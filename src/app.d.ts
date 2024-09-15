// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export type Egg = {
	rank: EggRank,
	animeNum: number
	imgId: string
	startEggRank: EggRank
	isOpen: boolean
}

export type EggRank = "r" | "g" | "s" | "b" | "w";

export { }

