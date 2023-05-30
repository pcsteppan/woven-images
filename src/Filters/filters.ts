type FrequencyMap = Map<number, number>;
export type MarkovChainData = Map<string, FrequencyMap>;

export class MarkovChain {
    chain: MarkovChainData;
    
    constructor(data: Array<number>, length: number) {
        this.chain = this.generateMarkovChain(data, length);
    }

    generateMarkovChain(data: Array<number>, length: number) {
        const markovChain: MarkovChainData = new Map();

        for(let i = length; i < data.length; i++) {
            const prefix = data.slice(i-length, i);
            const result = data[i];
        
            if(!markovChain.has(prefix.toString())) {
                markovChain.set(prefix.toString(), new Map());
            }
            const frequency= markovChain.get(prefix.toString()) as Map<number,number>;
    
            if(!frequency.has(result)) {
                frequency.set(result, 1);
            } else {
                frequency.set(result, frequency.get(result) as number + 1);
            }
        }
    
        return markovChain;
    }

    getNext (frequencyTable: FrequencyMap) {
        const totalCount = Object.values(frequencyTable).reduce((a, c) => a+c);
        let random = Math.floor(Math.random() * totalCount) + 1;
    
        for(const [key, value] of Object.entries(frequencyTable)) {
            if(random <= value) {
                return parseInt(key);
            } else {
                random -= value;
            }
        }
        
        return parseInt(Object.values(frequencyTable)[0]);
    }

    walk(distance: number, initial: Array<number>) {
        const markovWalk = [...initial];
        let lookup = [...initial];
        while(markovWalk.length < distance)
        {
            const frequencyTable = this.chain.get(lookup.toString());
    
            if(!frequencyTable) {
                lookup = [...initial];
                markovWalk.push(...initial);
                continue;
            }
    
            const result = this.getNext(frequencyTable);
            lookup.push(result);
            lookup = lookup.slice(1);
            markovWalk.push(result);
        }
        return markovWalk.slice(0, distance);
    }
}