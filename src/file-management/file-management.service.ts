import { Injectable, Logger } from '@nestjs/common';
import { drive_v3, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from '@/enums/env.enum';
import { extension } from 'mime-types';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  ReadStream,
  rm,
} from 'fs';
import { join } from 'path';

@Injectable()
export class FileManagementService {
  private driveService;
  private googleDriveFolderMimeType = 'application/vnd.google-apps.folder';
  private rootFolder = 'arene';
  private readonly logger = new Logger(FileManagementService.name);

  constructor(private readonly configService: ConfigService) {
    const jsonAuth = this.configService.get(
      EnvironmentVariable.GOOGLE_SERVICE_ACCOUNT,
    );

    if (!jsonAuth) {
      const errorMessage = 'Not found json to auth on google drive';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const parsedJsonAuth = JSON.parse(jsonAuth);

    const googleAuth = new google.auth.GoogleAuth({
      credentials: parsedJsonAuth,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.driveService = google.drive({
      version: 'v3',
      auth: googleAuth,
    });
  }

  private async createFolder(folderName: string, parentFolderId?: string) {
    return this.driveService.files.create({
      requestBody: {
        name: folderName,
        mimeType: this.googleDriveFolderMimeType,
        parents: parentFolderId ? [parentFolderId] : undefined,
      },
    });
  }

  /**
   * @returns folder id for the searched folder or folder id for the new one
   */
  private async getOrCreateFolder(foldername: string, parentFolderId?: string) {
    let result: string;
    try {
      let query = `name = '${foldername}'`;

      if (parentFolderId) {
        query = `${query} and '${parentFolderId}' in parents`;
      }

      const listResult = await this.driveService.files.list({
        fields: 'files(id, name)',
        q: query,
      });

      this.logger.debug(
        `Files found for folder ${foldername}: ${
          listResult.data.files?.length || 0
        }`,
      );

      const folderId = listResult.data.files?.shift()?.id;

      if (!folderId) {
        throw new Error(`Folder not found on drive: ${foldername}`);
      }

      result = folderId;
    } catch (error) {
      this.logger.debug(error);
      const folderCreated = await this.createFolder(foldername, parentFolderId);

      const folderId = folderCreated.data.id;

      this.logger.debug(`Created folder ${folderId}`);

      if (!folderId) {
        throw new Error(`Could not create folder ${foldername}`);
      }

      result = folderId;
    }

    return result;
  }

  private async getFolderFileId(pathlike?: string) {
    const pathParts = pathlike ? pathlike.split('/') : [];

    let lastFolderFileId = await this.getOrCreateFolder(this.rootFolder);

    for (const pathPart of pathParts) {
      const folderId = await this.getOrCreateFolder(pathPart, lastFolderFileId);

      lastFolderFileId = folderId;
    }

    return lastFolderFileId;
  }

  /**
   * @param params.filePath path to local file
   * @param params.googleDriveFilePath path like to folder in google drive, separated by "/"
   * @returns file id in google drive
   */
  async uploadToDrive(params: {
    fileInput: ReadStream;
    mimetype: string;
    googleDriveFilePath: string;
  }): Promise<string> {
    const { fileInput, googleDriveFilePath, mimetype } = params;

    let fileMetadata: drive_v3.Schema$File = {
      name: `${new Date().getTime()}.${extension(mimetype)}`,
      mimeType: mimetype,
    };

    const media = {
      mimeType: mimetype,
      body: fileInput,
    };

    /* Get or create folder file id from google drive */

    const parentFolderFileId = await this.getFolderFileId(googleDriveFilePath);

    if (parentFolderFileId) {
      fileMetadata = {
        ...fileMetadata,
        parents: [parentFolderFileId],
      };
    }

    const response = await this.driveService.files.create({
      media,
      requestBody: fileMetadata,
      fields: 'id',
    });

    if (response.status !== 200 || !response.data.id) {
      this.logger.debug(response);
      throw new Error('Error subiendo el archivo');
    }

    return response.data.id;
  }

  private getExportsFolderPath() {
    const exportsFolderPath = join(process.cwd(), 'exports');
    if (!existsSync(exportsFolderPath)) {
      mkdirSync(exportsFolderPath, {
        recursive: true,
      });
    }

    return exportsFolderPath;
  }

  async downloadFileFromDriveByFileId(fileId: string) {
    const fileResponse = await this.driveService.files.get(
      {
        fileId,
        alt: 'media',
      },
      {
        responseType: 'stream',
      },
    );

    this.logger.debug(`Successfully downloaded file ${fileId}`);

    const fileData = fileResponse.data;

    const exportsFolderPath = this.getExportsFolderPath();

    const newFilePath = join(exportsFolderPath, fileId);

    const writeStream = createWriteStream(newFilePath);

    await new Promise((resolve, reject) => {
      fileData.pipe(writeStream).on('finish', resolve).on('error', reject);
    });

    this.logger.debug(`Successfully created file ${newFilePath}`);

    const fileBase64 = readFileSync(newFilePath, {
      encoding: 'base64',
    });

    rm(newFilePath, () => {
      this.logger.debug(`Successfully deleted file ${newFilePath}`);
    });

    return fileBase64;
  }
}
