class GeneticsTreeGenerator {
    constructor() {
        this.generationsInput = document.getElementById('generationsInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.familyTree = document.getElementById('familyTree');
        this.loading = document.getElementById('loading');
        this.statsContainer = document.getElementById('statsContainer');
        this.statsGrid = document.getElementById('statsGrid');

        this.currentFamily = null;
        this.bloodTypeStats = {};

        this.init();
    }

    init() {
        this.generateBtn.addEventListener('click', () => this.generateFamily());
        this.clearBtn.addEventListener('click', () => this.clearTree());

        this.generateFamily();
    }

    async generateFamily() {
        const generations = parseInt(this.generationsInput.value);

        if (generations < 1 || generations > 5) {
            alert('Please enter a number between 1 and 5 for generations.');
            return;
        }

        this.showLoading(true);
        this.generateBtn.disabled = true;

        try {
            const response = await fetch('/generate_family', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    generations: generations
                })
            });

            const data = await response.json();

            await new Promise(resolve => setTimeout(resolve, 1000));

            this.currentFamily = data.family;
            this.displayFamily(this.currentFamily, generations);

        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.currentFamily = this.createFamily(generations);
            this.displayFamily(this.currentFamily, generations);
        } finally {
            this.showLoading(false);
            this.generateBtn.disabled = false;
        }
    }

    createFamily(generations) {
        const person = {
            parents: [null, null],
            alleles: ["", ""]
        };

        if (generations > 1) {
            person.parents[0] = this.createFamily(generations - 1);
            person.parents[1] = this.createFamily(generations - 1);

            person.alleles[0] = this.randomChoice(person.parents[0].alleles);
            person.alleles[1] = this.randomChoice(person.parents[1].alleles);
        } else {
            person.parents = [null, null];
            person.alleles[0] = this.randomAllele();
            person.alleles[1] = this.randomAllele();
        }

        return person;
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    randomAllele() {
        return this.randomChoice(['A', 'B', 'O']);
    }

    getBloodType(alleles) {
        const [allele1, allele2] = alleles.sort();

        if (allele1 === 'A' && allele2 === 'A') return 'A';
        if (allele1 === 'A' && allele2 === 'B') return 'AB';
        if (allele1 === 'A' && allele2 === 'O') return 'A';
        if (allele1 === 'B' && allele2 === 'B') return 'B';
        if (allele1 === 'B' && allele2 === 'O') return 'B';
        if (allele1 === 'O' && allele2 === 'O') return 'O';

        return 'Unknown';
    }

    getPersonRole(generation) {
        if (generation === 0) return 'Child';
        if (generation === 1) return 'Parent';
        if (generation === 2) return 'Grandparent';

        const greats = 'Great-'.repeat(generation - 2);
        return `${greats}Grandparent`;
    }

    displayFamily(person, totalGenerations) {
        this.familyTree.innerHTML = '';
        this.bloodTypeStats = {
            A: 0,
            B: 0,
            AB: 0,
            O: 0
        };

        const treeStructure = this.buildTreeStructure(person, 0, totalGenerations);
        this.renderTree(treeStructure);
        this.updateStats();
    }

    buildTreeStructure(person, generation, totalGenerations) {
        if (!person) return null;

        const bloodType = this.getBloodType(person.alleles);
        this.bloodTypeStats[bloodType]++;

        const node = {
            person: person,
            generation: generation,
            bloodType: bloodType,
            role: this.getPersonRole(generation),
            children: []
        };

        if (person.parents[0] || person.parents[1]) {
            if (person.parents[0]) {
                node.children.push(this.buildTreeStructure(person.parents[0], generation + 1, totalGenerations));
            }
            if (person.parents[1]) {
                node.children.push(this.buildTreeStructure(person.parents[1], generation + 1, totalGenerations));
            }
        }

        return node;
    }

    renderTree(treeStructure) {
        const generations = this.organizeByGeneration(treeStructure);

        generations.forEach((generationNodes, genIndex) => {
            const generationDiv = document.createElement('div');
            generationDiv.className = 'generation';

            generationNodes.forEach((node, nodeIndex) => {
                const personElement = this.createPersonElement(node, nodeIndex);
                generationDiv.appendChild(personElement);
            });

            this.familyTree.appendChild(generationDiv);
        });
    }

    organizeByGeneration(treeStructure) {
        const generations = [];

        const traverse = (node, generation) => {
            if (!node) return;

            if (!generations[generation]) {
                generations[generation] = [];
            }

            generations[generation].push(node);

            node.children.forEach(child => {
                traverse(child, generation + 1);
            });
        };

        traverse(treeStructure, 0);
        return generations;
    }

    createPersonElement(node, index) {
        const personDiv = document.createElement('div');
        personDiv.className = 'person';
        personDiv.style.animationDelay = `${index * 0.2}s`;

        const cardDiv = document.createElement('div');
        cardDiv.className = `person-card blood-type-${node.bloodType}`;

        const iconDiv = document.createElement('div');
        iconDiv.className = `person-icon generation-${node.generation}`;
        iconDiv.textContent = this.getPersonIcon(node.generation);

        const roleDiv = document.createElement('div');
        roleDiv.className = 'person-role';
        roleDiv.textContent = `${node.role} (Gen ${node.generation})`;

        const bloodTypeDiv = document.createElement('div');
        bloodTypeDiv.className = 'blood-type';
        bloodTypeDiv.style.color = this.getBloodTypeColor(node.bloodType);
        bloodTypeDiv.textContent = `Type ${node.bloodType}`;

        const allelesDiv = document.createElement('div');
        allelesDiv.className = 'alleles';
        allelesDiv.textContent = `${node.person.alleles[0]}${node.person.alleles[1]}`;

        cardDiv.appendChild(iconDiv);
        cardDiv.appendChild(roleDiv);
        cardDiv.appendChild(bloodTypeDiv);
        cardDiv.appendChild(allelesDiv);

        personDiv.appendChild(cardDiv);

        cardDiv.addEventListener('click', () => {
            this.showPersonDetails(node);
        });

        return personDiv;
    }

    getPersonIcon(generation) {
        const icons = ['👶', '👨‍👩', '👴', '👵', '🧓'];
        return icons[Math.min(generation, icons.length - 1)];
    }

    getBloodTypeColor(bloodType) {
        const colors = {
            'A': 'var(--blood-a)',
            'B': 'var(--blood-b)',
            'AB': 'var(--blood-ab)',
            'O': 'var(--blood-o)'
        };
        return colors[bloodType] || 'var(--text-primary)';
    }

    showPersonDetails(node) {
        const details = `
            Person Details:
            Role: ${node.role} (Generation ${node.generation})
            Blood Type: ${node.bloodType}
            Alleles: ${node.person.alleles[0]}${node.person.alleles[1]}

            Genetic Information:
            - Inherited ${node.person.alleles[0]} from one parent
            - Inherited ${node.person.alleles[1]} from other parent
            - Blood type determined by allele combination
        `;
        alert(details);
    }

    updateStats() {
        const totalPeople = Object.values(this.bloodTypeStats).reduce((sum, count) => sum + count, 0);

        this.statsGrid.innerHTML = '';

        Object.entries(this.bloodTypeStats).forEach(([bloodType, count]) => {
            const percentage = totalPeople > 0 ? ((count / totalPeople) * 100).toFixed(1) : 0;

            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            statItem.innerHTML = `
                <div class="stat-value" style="color: ${this.getBloodTypeColor(bloodType)}">${count}</div>
                <div class="stat-label">Type ${bloodType} (${percentage}%)</div>
            `;

            this.statsGrid.appendChild(statItem);
        });

        const totalItem = document.createElement('div');
        totalItem.className = 'stat-item';
        totalItem.innerHTML = `
            <div class="stat-value">${totalPeople}</div>
            <div class="stat-label">Total People</div>
        `;
        this.statsGrid.appendChild(totalItem);

        this.statsContainer.style.display = 'block';
    }

    clearTree() {
        this.familyTree.innerHTML = '';
        this.statsContainer.style.display = 'none';
        this.currentFamily = null;
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
        this.familyTree.style.display = show ? 'none' : 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GeneticsTreeGenerator();
});
