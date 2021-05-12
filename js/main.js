/**
 * 
 * @param {*} d1 
 * @param {*} d2 
 * 
 * Ref: https://pt.stackoverflow.com/questions/86762/calcular-diferen%C3%A7a-entre-duas-datas-para-validar-campos-da-data
 * Exemplo: 
    var dataInicio = new Date(document.getElementById("datainicio").value);
    var dataFim = new Date(document.getElementById("datafim").value);
    var diffMilissegundos = dataFim - dataInicio;
    var diffSegundos = diffMilissegundos / 1000;
    var diffMinutos = diffSegundos / 60;
    var diffHoras = diffMinutos / 60;
    var diffDias = diffHoras / 24;
    var diffMeses = diffDias / 30;

    return !(diffMeses > 3);
 */
function getDiffMinutes(dtOlder, dtNewer) {

    const diffMilissegundos = dtNewer - dtOlder;
    const diffSegundos = diffMilissegundos / 1000;
    return diffSegundos / 60;
    
}

class CacheControl {

    static __path = "repositories"

    static baseObj = {
        time: new Date(),
        obj: undefined,
    }

    static saveCache(obj) {

        this.baseObj.time = new Date();
        this.baseObj.obj = obj;

        localStorage.setItem(this.__path, JSON.stringify(this.baseObj));

    }

    static loadCache() {

        const item = localStorage.getItem(this.__path);
        if (!item) return undefined;
        this.baseObj = JSON.parse(item);
        console.log('onde estamos', this.baseObj);
        if (this.isTimeExpired(this.baseObj.time)) return undefined;
        return this.baseObj.obj;

    }

    static isTimeExpired(time) {
        
        const maxMinutes = 30;
        const diff = getDiffMinutes(new Date(time), new Date());
        console.log('time diff', diff);
        return diff > maxMinutes;

    }

}

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

        const cache = CacheControl.loadCache();
        if (cache) return Promise.resolve(cache);
        
        const url = 'https://api.github.com/users/lucascm/repos';
        
        try {
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`getRepositories error (${ response.status }): ${await response.text()}`);
            const json = await response.json();
            CacheControl.saveCache(json);
            return Promise.resolve(json);

        } catch (error) {

            console.error(error);
            return Promise.reject(error.message);
            
        }

    }

}

new Index();