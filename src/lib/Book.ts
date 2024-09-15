const SAVE_KEY = "SUPER-RARE-DROP";

export const save = (charaId: string) => {
    const charaIdList = loadAll();

    if (charaIdList.includes(charaId)) return;

    localStorage.setItem(SAVE_KEY, JSON.stringify([...charaIdList, charaId]));
}

export const loadAll = () => {
    const json = localStorage.getItem(SAVE_KEY);

    if (json) {
        return JSON.parse(json);
    } else {
        return [];
    }
}