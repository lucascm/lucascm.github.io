class Index {

    constructor() {

        this.divSocial = document.querySelector('#socialButtons');
        this.templateRepo = document.querySelector('#repoCard');
        this.divRepositories = document.querySelector('#repositories');
        this.addNewRepoCard('ImportVRA', 'Projeto TCC', 'link1, link2');

    }

    addNewRepoCard(title, desc, links) {

        const div = this.templateRepo.content.cloneNode(true);
        const cardTitle = div.querySelector('.title');
        const cardBody = div.querySelector('.description');
        const cardLinks = div.querySelector('.links');
        cardTitle.textContent = title;
        cardBody.textContent = desc;
        cardLinks.textContent = links;
        this.divRepositories.appendChild(div);
        
    }



}

new Index();