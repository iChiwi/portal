window.DriveService = class DriveService {
    static async uploadFile(file, subject, chapter, uploader) {
        try {
            let subjectFolder = await this.findOrCreateFolder(subject, window.config.ROOT_FOLDER_ID);
            
            let parentFolderId = subjectFolder.id;
            if (chapter) {
                let chapterFolder = await this.findOrCreateFolder(chapter, subjectFolder.id);
                parentFolderId = chapterFolder.id;
            }
            
            const metadata = {
                'name': file.name,
                'parents': [parentFolderId]
            };

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', file);

            const accessToken = gapi.client.getToken().access_token;
            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
                body: form
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error in uploadFile:', error);
            throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }
    }

    static async findOrCreateFolder(folderName, parentId) {
        try {
            let response = await gapi.client.drive.files.list({
                q: `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: 'files(id, name)'
            });

            if (response.result.files.length > 0) {
                return response.result.files[0];
            }

            const folderMetadata = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parentId]
            };

            const createResponse = await gapi.client.drive.files.create({
                resource: folderMetadata,
                fields: 'id, name'
            });

            return createResponse.result;
        } catch (error) {
            console.error('Error in findOrCreateFolder:', error);
            throw new Error(`Failed to find/create folder ${folderName}: ${error.message}`);
        }
    }
}
