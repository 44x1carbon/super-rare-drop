<script lang="ts">
  import { _a, off, offset, on } from "$lib";
  import { onMount } from "svelte";
  import type { Egg } from "../../app";
  import { ANIME_DATA } from "../../data/anime";
  import { CHARA_DATA } from "../../data/chara";

  export let egg: Egg;
  export let onFinishAnime: (egg: Egg) => void = () => {};
  export let onClose: () => void = () => {};

  // @ts-ignore
  $: startEggRank = ANIME_DATA[egg.animeNum].startRank as EggRank;
  // @ts-ignore
  $: loading = ANIME_DATA[egg.animeNum].loading;
  // @ts-ignore
  $: chara = CHARA_DATA[egg.imgId];

  let progress = 0;
  let isAnimeEnd = false;

  async function doAnime() {
    // ローディング演出
    on("loading");
    await new Promise((r) => {
      const timer = setInterval(() => {
        progress += 10;

        if (progress > loading) {
          clearInterval(timer);
          setTimeout(() => {
            off("loading");
            r("");
          }, 300);
        }
      }, 10);
    });

    // アニメーション処理
    on("egg");

    on("liquid-bottle");
    await _a({
      targets: "#liquid-bottle",
      rotate: "-20deg",
      duration: 1000,
      easing: "linear",
    });
    off("liquid-bottle");
    on("liquid-bottle-rotate");
    on("liquid");
    await Promise.all([
      _a({
        targets: "#liquid",
        translateY: 520,
        duration: 5000,
        easing: "easeOutQuad",
      }),
      offset(800, async () => {
        on("liquid-pool");
        _a({
          targets: "#liquid-pool",
          opacity: 1,
          duration: 1000,
          easing: "linear",
        });
      }),
      offset(1300, async () => {
        off("egg");
        on("egg-replace");
      }),
    ]);

    off("liquid");

    // 卵が割れる演出
    off("egg-replace");
    on("split-egg");
    await Promise.all([
      _a({
        targets: "#egg-l",
        rotate: -30,
        duration: 2000,
      }),
      _a({
        targets: "#egg-r",
        rotate: 30,
        duration: 2000,
      }),
      offset(1000, async () => {
        on("chara");
        await _a({
          targets: "#chara",
          opacity: 1,
          duration: 2000,
        });
      }),
    ]);

    isAnimeEnd = true;
    onFinishAnime(egg);
  }

  onMount(() => {
    doAnime();
  });
</script>

<div class="fixed top-0 left-0 p-4 bg-black/10 h-screen w-screen z-50">
  <div class="h-[100%]">
    <div
      class="h-[90%] w-full bg-white relative left-1/2 transform -translate-x-1/2"
    >
      <!-- ローディング -->
      <div
        id="loading"
        class="p-2 absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style="display: none;"
      >
        <div>Loading...</div>
        <div>
          <progress max="100" value={(progress / loading) * 100} class="w-full"
          ></progress>
        </div>
      </div>

      <!-- 最初の卵 -->
      <img
        id="egg"
        src={`/egg-${startEggRank}.png`}
        alt=""
        class="absolute bottom-[5%] z-10"
        style="display: none;"
      />

      <!-- 置き換わりの卵 -->
      <img
        id="egg-replace"
        src={`/egg-${egg.rank}.png`}
        alt=""
        class="absolute bottom-[5%] z-10"
        style="display: none;"
      />

      <!--  -->
      <img
        id="liquid-bottle"
        src={`/liquid-bottle.png`}
        alt=""
        class="absolute top-[-9%] right-[-5%] -rotate-90 origin-center w-3/4"
        style="display: none;"
      />

      <img
        id="liquid-bottle-rotate"
        src={`/liquid-bottle-rotate.png`}
        alt=""
        class="absolute top-[-9%] right-[-12%] origin-center w-5/6"
        style="display: none;"
      />

      <div class="absolute h-[80%] w-full top-[6.7%] overflow-hidden">
        <img
          id="liquid"
          src={`/liquid.png`}
          alt=""
          class="absolute top-[17%] left-0 transform w-full -translate-x-1/2 z-20 origin-center"
          style="display: none;"
        />
      </div>

      <img
        id="liquid-pool"
        src={`/liquid-pool.png`}
        alt=""
        class="absolute bottom-[4%]"
        style="display: none; opacity: 0;"
      />

      <div
        id="split-egg"
        class="absolute top-0 left-0 w-full h-full"
        style="display: none;"
      >
        <img
          id="egg-l"
          src={`/egg-${egg.rank}-l.png`}
          alt=""
          style="transform-origin: 50% 100%;"
          class="absolute bottom-[5%]"
        />
        <img
          id="egg-r"
          src={`/egg-${egg.rank}-r.png`}
          alt=""
          style="transform-origin: 50% 100%;"
          class="absolute bottom-[5%]"
        />
      </div>

      <div
        id="chara"
        class="absolute bottom-[20%] w-full"
        style="display: none; opacity: 0.5;"
      >
        <div class="">
          <img src={`/chara/${egg.imgId}.png`} alt="" id="chara-img" />
          <div class="absolute bottom-[10%] left-0 w-full">
            <div
              class="flex gap-4 justify-center text-xl font-bold bg-black/50 w-fit mx-auto p-2 text-white"
            >
              <div>{chara.rank}</div>
              <div>{chara.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {#if isAnimeEnd}
      <div class="relative mt-4 w-full">
        <button
          class="border rounded p-3 bg-blue-500 text-white font-bold shadow-lg w-full"
          on:click={onClose}
        >
          閉じる
        </button>
      </div>
    {/if}
  </div>
</div>
