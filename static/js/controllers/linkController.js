document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('category-select');
    const sectionGroupSelect = document.getElementById('section-group-select');
    const linksContainer = document.getElementById('links-container');

    // Official links data
    const officialLinks = [
        {
            title: 'WhatsApp Official Group',
            url: 'https://chat.whatsapp.com/IjOWZWFjWtR8L2vv2Zl0e9',
            icon: 'fab fa-whatsapp'
        },
                {
            title: 'Facebook Official Group',
            url: 'https://www.facebook.com/groups/533262599179541/',
            icon: 'fab fa-facebook'
        },
        {
            title: 'Telegram Groups Folder',
            url: 'https://t.me/addlist/hei45JMwINMxNjU8',
            icon: 'fab fa-telegram'
        }
    ];

    // Section ranges for each group
    const sectionRanges = {
        'A1': { start: 1, end: 6 },
        'A2': { start: 7, end: 12 },
        'A3': { start: 13, end: 18 },
        'A4': { start: 19, end: 24 },
        'A5': { start: 25, end: 32 }
    };

    // Section links data
    const sectionLinks = {
        'A1': {
            1: 'https://chat.whatsapp.com/DIYJl1uRKdm7VpFvQf0OdD',
            2: 'https://chat.whatsapp.com/KYpOX474pM8I4EbzKHZbHU',
            3: 'https://chat.whatsapp.com/GMGjGrtNPIE5fOKOjMiMHC',
            4: 'https://chat.whatsapp.com/BVqE70xAZnMHiuvb1AOQGb',
            5: 'https://chat.whatsapp.com/H6u9JU5QI2rFKL5OL157w7',
            6: 'https://chat.whatsapp.com/IpEeeiscYzaByuQe7uV3qY'
        },
        'A2': {
            7: 'https://chat.whatsapp.com/BlIYqOFMZlsKo7NJj5jAcc',
            8: 'https://chat.whatsapp.com/Il6XL0yTy2x684L6xujFLX',
            9: 'https://chat.whatsapp.com/JkhN323jEvEFuN35H2YP9d',
            10: 'https://chat.whatsapp.com/HF6e3nFpIGS5IHK5iCmMZO',
            11: 'https://chat.whatsapp.com/ICZINbMTGVE2hcjCJO2i4P',
            12: 'https://chat.whatsapp.com/C9aFGiHCDXJExLOIjnMmhP'
        },
        'A3': {
            13: 'https://chat.whatsapp.com/FYs0gz0Ukqn9fPVrqdpGNg',
            14: 'https://chat.whatsapp.com/DIb4XDllnq1D8R8XPNechn',
            15: 'https://chat.whatsapp.com/GsEA0QzCi0M1DyNVPLIi9I',
            16: 'https://chat.whatsapp.com/KmFRD5rG9y9Ds0mls0Ts5E',
            17: 'https://chat.whatsapp.com/JsVrQXDf6ql9cLfnEtEDDr',
            18: 'https://chat.whatsapp.com/GSi5BqL1LW6IDjr6RFIn98'
        },
        'A4': {
            19: 'https://chat.whatsapp.com/IUqSTGCfhP0GUVLHUE9ojr',
            20: 'https://chat.whatsapp.com/Jin5AYA0i2QLEmnV6gDnDf',
            21: 'https://chat.whatsapp.com/KFFJUhZB4pDH06nce63Lvl',
            22: 'https://chat.whatsapp.com/EmFe5jfigx65lw4YEtTsPi',
            23: 'https://chat.whatsapp.com/L9Wgh9cSzvqD42XGpZKGl2',
            24: 'https://chat.whatsapp.com/GPVWRb2uOlMF3Q5rGwIwWv',
            25: 'https://chat.whatsapp.com/CbCvveXuFXy3pKj97svEBk'
        },
        'A5': {
            26: 'https://chat.whatsapp.com/IwF3ozgNCLfLngru6MmeQW',
            27: 'https://chat.whatsapp.com/BO6L6cFoGjXIULs0hw7kkR',
            28: 'https://chat.whatsapp.com/KeAKllhwqCL372Jl1dftGU',
            29: 'https://chat.whatsapp.com/G5XHm6QrJ8P5B1pPWq1Ybq',
            30: 'https://chat.whatsapp.com/GNL1zgCtjbW06VFLsBxCPs',
            31: 'https://chat.whatsapp.com/EX6nGAHJdXx2TenlXKKt2H',
            32: 'https://chat.whatsapp.com/C0oxo4rLmhb3YRfetpOZwY'
        }
    };

    const subjectData = {
        'or': {
            name: 'Operations Research',
            links: [
                { title: 'Telegram Group', url: 'https://t.me/+26VqUfGuyWIxMmI0', icon: 'fab fa-telegram' },
                { title: 'Main Group', url: 'https://www.facebook.com/groups/1433524621387259/', icon: 'fab fa-facebook' },
                { title: 'Eng. Mahmoud Ibrahim', url: 'https://t.me/+lFd-izUo6f1jYzc0', icon: 'fab fa-telegram' },
                { title: 'Eng. Esraa Zakaria', url: 'https://t.me/+GUI2gl2ymkJkOTM0', icon: 'fab fa-telegram' },
                { title: 'Eng. Mohamed Gamal', url: 'https://chat.whatsapp.com/Fw5rVCRHo45JgCOQmON0Hv', icon: 'fab fa-whatsapp' }
            ]
        },
        'dld': {
            name: 'Digital Logic Design',
            links: [
                { title: 'Telegram Group', url: 'https://t.me/+gDEVMB_gODQ4MWFk', icon: 'fab fa-telegram' },
                { title: 'Main Group', url: 'https://www.facebook.com/groups/929367915989320', icon: 'fab fa-facebook' },
                { title: 'Eng. Nada Nagy', url: 'https://www.facebook.com/groups/1432559561052018/', icon: 'fab fa-facebook' },
                { title: 'Eng. Eman Selim', url: 'https://www.facebook.com/groups/1146313266934453/', icon: 'fab fa-facebook' },
                { title: 'Eng. Yasmina', url: 'https://chat.whatsapp.com/BpOgPfN30HZ3OFvvcpGzj0', icon: 'fab fa-whatsapp' },
                { title: 'Eng. Ahmed Daoud', url: 'https://www.facebook.com/groups/9154563387925951', icon: 'fab fa-facebook' }
            ]
        },
        'prog2': {
            name: 'Programming II',
            links: [
                { title: 'Telegram Group', url: 'https://t.me/+9F26Dl64l7NhZTE0', icon: 'fab fa-telegram' },
                { title: 'Main Group', url: 'https://www.facebook.com/groups/958906026340518/', icon: 'fab fa-facebook' },
                { title: 'Eng. Waleed', url: 'https://chat.whatsapp.com/Fi6EQDfXaQBIq2wW93Wjx8', icon: 'fab fa-whatsapp' },
                { title: 'Eng. Dina Atef', url: 'https://t.me/+f6YTkkGesDQ3ZjRk', icon: 'fab fa-telegram' },
                { title: 'Eng. Basma Eldrandaly', url: 'https://www.facebook.com/groups/2063433614101988/', icon: 'fab fa-facebook' }
            ]
        },
        'math2': {
            name: 'Mathematics II',
            links: [
                { title: 'Telegram Group', url: 'https://t.me/+sqeD8tpLBu0zYWVk', icon: 'fab fa-telegram' },
                { title: 'Main Group', url: 'https://www.facebook.com/groups/1057342902690248/', icon: 'fab fa-facebook' },
                { title: 'Eng. Reham Sheerah', url: 'https://chat.whatsapp.com/Inn7b3Nk5VaIoNNYqirnY2', icon: 'fab fa-whatsapp' },
                { title: 'Eng. Kholoud Mohsen', url: 'https://t.me/+XNzvH4v42fg2MGU0', icon: 'fab fa-telegram' },
                { title: 'Eng. Shawky Elgendy', url: 'https://www.facebook.com/groups/9123048427742202/', icon: 'fab fa-facebook' }
            ]
        },
        'discrete': {
            name: 'Discrete Structures',
            links: [
                { title: 'Telegram Group', url: 'https://t.me/+RXAu_X1Ae0k2MWI0', icon: 'fab fa-telegram' },
                { title: 'Main Group', url: 'https://www.facebook.com/share/g/17eXu4eN21/', icon: 'fab fa-facebook' },
                { title: 'Eng. Kholoud Mohsen', url: 'https://t.me/+OC512gg56G4zNmVk', icon: 'fab fa-telegram' },
                { title: 'Eng. Esraa Elgdawy', url: 'https://t.me/+1sAfVO5QRMAzZmQ8', icon: 'fab fa-telegram' },
                { title: 'Eng. Ahmed Abdelmonem', url: 'https://www.facebook.com/groups/1618108745481669', icon: 'fab fa-facebook' },
                { title: 'Eng. Shawky Elgendy', url: 'https://www.facebook.com/groups/9123048427742202/', icon: 'fab fa-facebook' }
            ]
        },
        'ethics': {
            name: 'Ethics',
            links: [
                { title: 'Telegram Group', url: 'https://t.me/+g4oP36f9lwQ0NTE0', icon: 'fab fa-telegram' },
                { title: 'Main Group', url: 'https://www.facebook.com/groups/1183186936718959', icon: 'fab fa-facebook' }
            ]
        },
        'hr': {
            name: 'Human Rights',
            links: [
                { title: 'Telegram Group', url: 'https://t.me/+Ob-alMZbbG85MmVk', icon: 'fab fa-telegram' },
                { title: 'Main Group', url: 'https://www.facebook.com/groups/1131230241882951/', icon: 'fab fa-facebook' }
            ]
        }
    };

    // Add subject select element
    const subjectSelect = document.createElement('select');
    subjectSelect.id = 'subject-select';
    subjectSelect.className = 'group-select';
    subjectSelect.style.display = 'none';

    // Add subject options
    let subjectOptionsHtml = '<option value="" selected disabled data-translate>Select Subject</option>';
    Object.entries(subjectData).forEach(([key, data]) => {
        subjectOptionsHtml += `<option value="${key}" data-translate>${data.name}</option>`;
    });
    subjectSelect.innerHTML = subjectOptionsHtml;

    // Insert after category select
    document.querySelector('.group-links').insertBefore(subjectSelect, sectionGroupSelect);

    categorySelect.addEventListener('change', function() {
        sectionGroupSelect.style.display = 'none';
        subjectSelect.style.display = 'none';
        linksContainer.innerHTML = '';

        if (this.value === 'official') {
            displayOfficialLinks();
        } else if (this.value === 'section') {
            sectionGroupSelect.style.display = 'block';
        } else if (this.value === 'subject') {
            subjectSelect.style.display = 'block';
        }
    });

    sectionGroupSelect.addEventListener('change', function() {
        const groupId = this.value;
        const range = sectionRanges[groupId];
        displaySectionLinks(groupId, range);
    });

    subjectSelect.addEventListener('change', function() {
        const subject = subjectData[this.value];
        if (subject) {
            displaySubjectLinks(subject);
        }
    });

    function displayOfficialLinks() {
        let html = '<div class="links-grid">';
        officialLinks.forEach(link => {
            html += `
                <a href="${link.url}" class="link-card" target="_blank" rel="noopener">
                    <i class="${link.icon}"></i>
                    <span data-translate>${link.title}</span>
                </a>
            `;
        });
        html += '</div>';
        linksContainer.innerHTML = html;
        refreshTranslations();
    }

    function displaySectionLinks(groupId, range) {
        let html = '<div class="links-grid">';
        for (let i = range.start; i <= range.end; i++) {
            html += `
                <a href="${sectionLinks[groupId][i]}" class="link-card" target="_blank" rel="noopener">
                    <i class="fab fa-whatsapp"></i>
                    <span data-translate>Section</span>${i}
                </a>
            `;
        }
        html += '</div>';
        linksContainer.innerHTML = html;
        refreshTranslations();
    }

    function displaySubjectLinks(subject) {
        let html = `
            <h3 data-translate>${subject.name}</h3>
            <div class="links-grid">
        `;
        
        subject.links.forEach(link => {
            html += `
                <a href="${link.url}" class="link-card" target="_blank" rel="noopener">
                    <i class="${link.icon}"></i>
                    <span data-translate>${link.title}</span>
                </a>
            `;
        });
        
        html += '</div>';
        linksContainer.innerHTML = html;
        refreshTranslations();
    }

    function refreshTranslations() {
        if (typeof storeOriginalTexts === 'function') {
            storeOriginalTexts();
            const currentLang = localStorage.getItem('lang') || 'ar';
            setLanguage(currentLang);
        }
    }
});
