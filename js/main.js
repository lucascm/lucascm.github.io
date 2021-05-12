class Index {

    constructor() {

        this.divSocial = document.querySelector('#socialButtons');
        this.templateRepo = document.querySelector('#repoCard');
        this.divRepositories = document.querySelector('#repositories');
        this.getRepositories()
            .then(json => this.createListRepo(json))
            .catch(error => console.log(error));

    }

    createListRepo(json) {

        console.log(json);
        const divs = json.map( repo => this.createNewRepoCard(
            repo.name, 
            repo.description,
            repo.language,
            [repo.html_url, repo.homepage]
        ));

        this.divRepositories.append(...divs);

    }

    createNewRepoCard(title, desc, tags, links) {

        const div = this.templateRepo.content.cloneNode(true);
        const cardTitle = div.querySelector('.title');
        const cardBody = div.querySelector('.description');
        const cardLang = div.querySelector('.language');
        const cardLinks = div.querySelector('.links');

        const linkToGit = cardLinks.querySelector('.git');
        const linkToHome = cardLinks.querySelector('.homepage');
        
        cardTitle.textContent = title;
        cardBody.textContent = desc;
        cardLang.textContent = tags;
        linkToGit.textContent = links[0];
        linkToHome.textContent = links[1];
        
        return div;
        
    }

    async getRepositories() {
        
        const url = 'https://api.github.com/users/lucascm/repos';
        
        try {
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`getRepositories error (${ response.status }): ${await response.text()}`);
            const json = await response.json();
            return Promise.resolve(json);

        } catch (error) {

            console.error(error);
            return Promise.reject(error.message);
            
        }

    }

}

new Index();