import _ from 'lodash';
import type { EggRank } from "../app";
import { ANIME_DATA } from '../data/anime';
import { CHARA_DATA } from "../data/chara";

type Chara = {
    id: string;
    rank: string;
    name: string;
};

const charaDataGroupByRank = Object.entries(CHARA_DATA)
    .map(([id, { rank, name }]) => {
        return {
            id,
            rank,
            name,
        };
    })
    .reduce(
        (p, c) => {
            if (p[c.rank] === undefined) {
                p[c.rank] = [];
            }

            p[c.rank].push(c);

            return p;
        },
        {} as Record<string, Chara[]>
    );

export const choiceChara = (rank: EggRank) => {
    const table = {
        "r": "LR",
        "g": "UR",
        "s": "SR",
        "b": "R",
        "w": "N"
    };

    const rarity = table[rank];

    const charaList = charaDataGroupByRank[rarity];
    const index = Math.floor(Math.random() * charaList.length);

    return charaList[index];
}

export const choiceEggRank = (rankList: EggRank[] = ["g", "s", "b", "w"]) => {
    const table = {
        "g": 0.1,
        "s": 0.2,
        "b": 0.3,
    }

    const selectList = Object.entries(table).filter(([k]) => rankList.includes(k as EggRank));
    const random = Math.random();

    const eggRank = _.minBy(selectList.filter(([_, v]) => v >= random), ([_, v]) => {
        return v;
    })?.[0] ?? "w";

    return eggRank
}

export const choiceAnimeNum = () => {
    const { r, g } = Object.entries(ANIME_DATA).reduce((p, c) => {
        // @ts-ignore
        if (p[c[1].startRank] === undefined) {
            // @ts-ignore
            p[c[1].startRank] = [];
        }

        // @ts-ignore
        p[c[1].startRank].push({
            animeNum: parseInt(c[0]),
            startRank: c[1].startRank,
            loading: c[1].loading
        });

        return p;
    }, {} as Record<"r" | "g", {
        animeNum: number,
        startRank: string
        loading: number
    }[]>);

    const target = 0.05 <= Math.random() ? r : g;
    const index = Math.floor(Math.random() * target.length)
    return target[index].animeNum;
}