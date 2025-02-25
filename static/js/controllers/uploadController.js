(function() {
    let tokenClient;
    let gapiInited = false;
    let gisInited = false;

    window.gapiLoaded = function() {
        gapi.load('client', initializeGapiClient);
    };

    window.gisLoaded = function() {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: window.config.CLIENT_ID,
            scope: window.config.SCOPES.join(' '),
            callback: handleAuthResponse
        });
        gisInited = true;
        maybeEnableButtons();
    };

    async function initializeGapiClient() {
        try {
            await gapi.client.init({
                apiKey: window.config.API_KEY,
                discoveryDocs: window.config.DISCOVERY_DOCS,
            });
            gapiInited = true;
            maybeEnableButtons();
        } catch (error) {
            console.error('Error initializing GAPI client:', error);
        }
    }

    function maybeEnableButtons() {
        if (gapiInited && gisInited) {
            const signinButton = document.getElementById('signin-button');
            if (signinButton) {
                signinButton.style.display = 'block';
            }
        }
    }

    window.handleAuthClick = function() {
        if (tokenClient) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        }
    };

    window.handleAuthResponse = async function(response) {
        if (response.error !== undefined) {
            throw response;
        }
        
        const signinButton = document.getElementById('signin-button');
        const submitButton = document.getElementById('submit-button');
        
        if (signinButton && submitButton) {
            signinButton.style.display = 'none';
            submitButton.style.display = 'block';
        }
        
        if (typeof displayUploadedSummaries === 'function') {
            await displayUploadedSummaries();
        }
    };
})();

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('signin-button').style.display = 'block';
        document.getElementById('submit-button').style.display = 'none';
    }
}

async function createFolderEmbeds() {
    try {
        const subject = document.getElementById('subject');
        const chapter = document.getElementById('chapter');
        const fileInput = document.getElementById('summary-file');
        const uploader = document.getElementById('uploader');

        if (!subject.value) {
            throw new Error('Please select a subject');
        }
        if (!fileInput.files.length) {
            throw new Error('Please select at least one file');
        }
        if (!uploader.value) {
            throw new Error('Please select your name');
        }
        if (typeof DriveService === 'undefined') {
            throw new Error('Drive service not initialized');
        }

        const uploadPromises = Array.from(fileInput.files).map(async file => {
            try {
                const result = await DriveService.uploadFile(
                    file, 
                    subject.value, 
                    chapter.value || null,
                    uploader.value
                );
                return result;
            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
                throw error;
            }
        });

        const results = await Promise.all(uploadPromises);
        return results;

    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

function initializeSubjectData() {
    const savedData = localStorage.getItem('subjectData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        window.subjectData = { ...window.subjectData, ...parsedData };
    }
}

document.addEventListener('DOMContentLoaded', initializeSubjectData);

async function displayUploadedSummaries() {
    const summariesList = document.getElementById('summaries-list');
    
    try {
        summariesList.innerHTML = '<p data-translate data-original="Loading summaries...">Loading summaries...</p>';
        storeOriginalTexts();
        setLanguage(localStorage.getItem('lang') || 'ar');

        if (!gapi.client?.drive) {
            await new Promise((resolve) => {
                const checkInit = setInterval(() => {
                    if (gapi.client?.drive) {
                        clearInterval(checkInit);
                        resolve();
                    }
                }, 100);
            });
        }

        const response = await gapi.client.drive.files.list({
            q: `'${window.config.ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`,
            fields: 'files(id, name)',
            orderBy: 'name'
        });

        if (!response.result.files || response.result.files.length === 0) {
            summariesList.innerHTML = '<p data-translate data-original="No subjects found">No subjects found</p>';
            storeOriginalTexts();
            setLanguage(localStorage.getItem('lang') || 'ar');
            return;
        }

        let summariesHTML = '<div class="summaries-container">';
        
        for (const folder of response.result.files) {
            const subjectFilesResponse = await gapi.client.drive.files.list({
                q: `'${folder.id}' in parents and mimeType != 'application/vnd.google-apps.folder'`,
                fields: 'files(id, name, mimeType)',
                orderBy: 'name'
            });

            const chaptersResponse = await gapi.client.drive.files.list({
                q: `'${folder.id}' in parents and mimeType='application/vnd.google-apps.folder'`,
                fields: 'files(id, name)',
                orderBy: 'name'
            });

            summariesHTML += `
                <div class="subject-section">
                    <h3 data-translate data-original="${folder.name}">${folder.name}</h3>`;

            if (subjectFilesResponse.result.files.length > 0) {
                summariesHTML += `
                    <div class="files-section">
                        <h4 data-translate data-original="Material">Material</h4>
                        <ul class="files-list">`;

                subjectFilesResponse.result.files.forEach(file => {
                    const icon = file.mimeType.includes('pdf') ? '📄' : '📝';
                    const viewUrl = `https://drive.google.com/file/d/${file.id}/view?usp=sharing`;
                    summariesHTML += `
                        <li>
                            <a href="${viewUrl}" target="_blank" rel="noopener">
                                ${icon} <span data-translate data-original="${file.name}">${file.name}</span>
                            </a>
                        </li>`;
                });

                summariesHTML += `</ul></div>`;
            }

            if (chaptersResponse.result.files.length > 0) {
                for (const chapter of chaptersResponse.result.files) {
                    const filesResponse = await gapi.client.drive.files.list({
                        q: `'${chapter.id}' in parents and mimeType != 'application/vnd.google-apps.folder'`,
                        fields: 'files(id, name, mimeType)',
                        orderBy: 'name'
                    });

                    if (filesResponse.result.files.length > 0) {
                        summariesHTML += `
                            <div class="chapter-section">
                                <h4 data-translate data-original="${chapter.name}">${chapter.name}</h4>
                                <ul class="files-list">`;

                        filesResponse.result.files.forEach(file => {
                            const icon = file.mimeType.includes('pdf') ? '📄' : '📝';
                            const viewUrl = `https://drive.google.com/file/d/${file.id}/view?usp=sharing`;
                            summariesHTML += `
                                <li>
                                    <a href="${viewUrl}" target="_blank" rel="noopener">
                                        ${icon} <span data-translate data-original="${file.name}">${file.name}</span>
                                    </a>
                                </li>`;
                        });

                        summariesHTML += `</ul></div>`;
                    }
                }
            } else {
                summariesHTML += '<p data-translate data-original="No chapters found">No chapters found</p>';
            }

            summariesHTML += `</div></div>`;
        }

        summariesList.innerHTML = summariesHTML;
        storeOriginalTexts();
        setLanguage(localStorage.getItem('lang') || 'ar');

    } catch (error) {
        console.error('Error displaying summaries:', error);
        summariesList.innerHTML = `
            <p class="error-message" data-translate data-original="Error loading summaries">
                Error loading summaries: ${error.message}
            </p>`;
        storeOriginalTexts();
        setLanguage(localStorage.getItem('lang') || 'ar');
    }
}
