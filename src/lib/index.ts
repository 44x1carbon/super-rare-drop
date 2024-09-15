import anime from "animejs";

export function on(id: string) {
    try {
        // @ts-ignore
        document.getElementById(id).style.display = "block";
    } catch {

    }

}

export function off(id: string) {
    try {
        // @ts-ignore
        document.getElementById(id).style.display = "none";
    } catch {

    }
}

export async function _a(param: any) {
    return new Promise((resolve) => {
        anime({
            ...param,
            complete: () => {
                resolve("");
            },
        });
    });
}

export async function offset(
    ms: number,
    fn: () => Promise<void> = () => {
        return new Promise((r) => {
            r();
        });
    }
) {
    return new Promise((r) =>
        setTimeout(async () => {
            fn().then(() => {
                r("");
            });

        }, ms)
    );
}