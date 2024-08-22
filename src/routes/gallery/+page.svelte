<script lang="ts">
	import { onMount } from 'svelte';
	import folder from '$lib/assets/folder.png';
	import home from '$lib/assets/home.png';
	import search from '$lib/assets/search.png';
	export let data;

	let width = 0;
	function handleResize() {
		width = window.innerWidth;
		isHorizontal = width < 1000 ? false : true;
		onOrientationChange();
	}

	let carousel: HTMLElement | null = null;
	let transitionElement: HTMLElement | null = null;
	let cells: NodeListOf<HTMLElement> | null = null;
	let searchElement: HTMLElement | null = null;
	let iconElement: HTMLElement | null = null;
	let textboxElement: HTMLElement | null = null;
	let cellCount: number = Object.keys(data['projects']).length;
	let selectedIndex: number = 0;
	let cellWidth: number = 0;
	let currentFolder: number = 0;
	let cellHeight: number = 0;
	let isHorizontal: boolean = true;
	let rotateFn: string = isHorizontal ? 'rotateY' : 'rotateX';
	let radius: number = 0;
	let theta: number = 360 / cellCount;
	let startY: number = 0;

	function rotateCarousel(): void {
		if (carousel && cells) {
			if (selectedIndex > cellCount) {
				currentFolder = selectedIndex % cellCount;
			} else if (selectedIndex < 1) {
				currentFolder = cellCount + (selectedIndex % cellCount);
			} else {
				currentFolder = selectedIndex;
			}
			if (currentFolder === cellCount) {
				currentFolder = 0;
			}
			const angle = theta * selectedIndex * -1;
			carousel.style.transform = `translateZ(${-radius}px) ${rotateFn}(${angle}deg)`;
			cells.forEach((cell, i) => {
				const angleDifference = Math.abs((selectedIndex - i) % cellCount) * theta;
				const opacity = Math.cos(angleDifference * (Math.PI / 180));
				cell.style.opacity = `${Math.max(opacity, 0.07)}`;
			});
		}
	}

	function changeCarousel(): void {
		if (cells && carousel) {
			cellWidth = carousel.offsetWidth;
			cellHeight = carousel.offsetHeight;
			const cellSize = isHorizontal ? cellWidth : cellHeight;
			radius = Math.round(cellSize / 2 / Math.tan(Math.PI / cellCount) + 500);

			cells.forEach((cell, i) => {
				if (i < cellCount) {
					const cellAngle = theta * i;
					cell.style.transform = `${rotateFn}(${cellAngle}deg) translateZ(${radius}px)`;
				} else {
					cell.style.opacity = '0';
					cell.style.transform = 'none';
				}
			});

			rotateCarousel();
		}
	}

	function onOrientationChange(): void {
		rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
		changeCarousel();
	}

	function onWheel(event: WheelEvent): void {
		event.preventDefault();
		if (event.deltaY > 0) {
			selectedIndex++;
		} else {
			selectedIndex--;
		}
		rotateCarousel();
	}

	function onTouchStart(event: TouchEvent): void {
		startY = event.touches[0].clientY;
	}

	function onTouchMove(event: TouchEvent): void {
		event.preventDefault();
	}

	function onTouchEnd(event: TouchEvent): void {
		const endY = event.changedTouches[0].clientY;
		if (startY - endY > 30) {
			selectedIndex--;
		} else if (endY - startY > 30) {
			selectedIndex++;
		}
		rotateCarousel();
	}

	function wait(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	function openSearch() {
		if (searchElement && textboxElement && iconElement) {
			searchElement.style.width = '50px';
			textboxElement.style.display = 'block';
			textboxElement.focus();
			searchElement.style.backgroundColor = '#f4f4f4';
			iconElement.style.filter = 'invert(0)';
			iconElement.style.cursor = 'default';
			searchElement.style.cursor = 'default';
			searchElement.style.justifyContent = 'left';
			searchElement.style.transition = 'width 0.3s ease';
			searchElement.offsetWidth;
			searchElement.style.width = '250px';
		}
	}

	async function closeSearch(event: MouseEvent) {
		if (
			searchElement &&
			textboxElement &&
			iconElement &&
			!searchElement.contains(event.target as Node)
		) {
			textboxElement.style.display = 'none';
			textboxElement.value = '';
			searchElement.style.width = '50px';
			searchElement.style.cursor = 'pointer';
			iconElement.style.cursor = 'pointer';
			await wait(70);
			searchElement.style.justifyContent = 'center';
		}
	}

	async function goHome() {
		if (transitionElement) {
			transitionElement.style.bottom = '0';
			transitionElement.style.height = '0px';
			transitionElement.style.transition = 'height 0.5s ease';
			transitionElement.offsetHeight;
			transitionElement.style.height = '100dvh';
		}
		await wait(500);
		window.location.href = '/';
	}

	onMount(() => {
		handleResize();
		window.addEventListener('resize', handleResize);

		carousel = document.querySelector('.carousel');
		cells = carousel?.querySelectorAll('.carousel__cell') || null;

		window.addEventListener('wheel', onWheel, { passive: false });
		window.addEventListener('touchstart', onTouchStart);
		window.addEventListener('touchmove', onTouchMove, { passive: false });
		window.addEventListener('touchend', onTouchEnd);
		window.addEventListener('click', closeSearch);

		const prevButton = document.querySelector('.previous-button');
		const nextButton = document.querySelector('.next-button');
		searchElement = document.getElementById('search');
		textboxElement = document.getElementById('textbox');
		iconElement = document.getElementById('icon');
		transitionElement = document.getElementById('transition');

		if (transitionElement) {
			transitionElement.style.height = '100dvh';
			transitionElement.style.transition = 'height 0.5s ease';
			transitionElement.offsetHeight;
			transitionElement.style.height = '0px';
		}

		prevButton?.addEventListener('click', () => {
			selectedIndex--;
			rotateCarousel();
		});

		nextButton?.addEventListener('click', () => {
			selectedIndex++;
			rotateCarousel();
		});

		const orientationRadios = document.querySelectorAll('input[name="orientation"]');
		orientationRadios.forEach((radio) => {
			radio.addEventListener('change', onOrientationChange);
		});

		onOrientationChange();
	});
</script>

<div class="transition" id="transition" />
<button id="home" on:click={goHome}>
	<img alt="home" src={home} />
</button>
<div id="search" role="button" on:click={openSearch}>
	<img alt="search" id="icon" src={search} />
	<input id="textbox" />
</div>
<div class="container">
	<div class="scene">
		<p class="folder-title">{data['projects'][currentFolder]['title']}</p>
		<div class="carousel">
			{#each data['projects'] as project}
				<div class="carousel__cell"><img alt="folder" src={folder} /></div>
			{/each}
		</div>
	</div>
	<div class="carousel-options">
		<button disabled={!isHorizontal} class="previous-button">Previous</button>
		<button disabled={!isHorizontal} class="next-button">Next</button>
	</div>
</div>

<style>
	@font-face {
		font-family: 'Panchang-Variable';
		src:
			url('$lib/assets/fonts/Panchang-Variable.woff2') format('woff2'),
			url('$lib/assets/fonts/Panchang-Variable.woff') format('woff'),
			url('$lib/assets/fonts/Panchang-Variable.ttf') format('truetype');
		font-weight: 200 800;
		font-display: swap;
		font-style: normal;
	}

	* {
		box-sizing: border-box;
		font-family: 'Panchang-Variable';
	}

	.transition {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100dvh;
		background-color: white;
		z-index: 200;
	}

	button {
		background-color: #f4f4f4;
		border: none;
		border-radius: 20px;
		color: black;
		width: 200px;
		user-select: none;
		height: 30px;
		text-align: center;
		text-decoration: none;
		cursor: pointer;
		display: inline-block;
		font-size: 16px;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	button:hover {
		background-color: black;
		color: white;
	}

	.container {
		width: 100vw;
		height: 100dvh;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		gap: 70px;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.scene {
		position: relative;
		width: 220px;
		height: 230px;
		margin: 0px auto;
		perspective: 2000px;
	}

	.folder-title {
		color: black;
		text-align: center;
		margin-top: -10px;
	}

	.carousel {
		width: 100%;
		height: 100%;
		position: absolute;
		transform: translateZ(-288px);
		transform-style: preserve-3d;
		transition: transform 1s;
	}

	#home {
		position: absolute;
		top: 10px;
		left: 10px;
		height: 35px;
		width: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		z-index: 10;
	}

	#home img {
		width: 15px;
		user-select: none;
		height: 15px;
		margin-top: -2px;
		margin-left: 0;
		padding: 0;
		transition: filter 0.5s ease;
	}

	#home:hover {
		background-color: #f4f4f4;
	}

	#search {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 50px;
		border-radius: 20px;
		background-color: #f4f4f4;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		z-index: 10;
		transition:
			background-color 0.3s ease,
			height 0.3s ease;
	}

	#search img {
		width: 35px;
		height: 35px;
		margin-bottom: 3px;
		margin-left: 0;
		user-select: none;
		padding: 0;
		transition: filter 0.5s ease;
	}

	#textbox {
		display: none;
		border: 0px;
		background-color: #f4f4f4;
		color: black;
		outline: none;
		width: 80%;
		margin-bottom: 2px;
	}

	@media (max-width: 400px) {
		#textbox {
			margin-bottom: -2px;
		}
	}

	img {
		width: 200px;
		margin-left: 0px;
		user-select: none;
	}

	.carousel__cell {
		position: absolute;
		width: 190px;
		height: 200px;
		left: 10px;
		top: 10px;
		line-height: 116px;
		font-size: 80px;
		font-weight: bold;
		color: white;
		text-align: center;
		transition:
			transform 1s,
			opacity 1s;
	}

	.carousel-options {
		display: flex;
		gap: 40px;
		text-align: center;
		z-index: 2;
		transition: opacity 0.5s ease;
	}

	@media (max-width: 1000px) {
		.carousel-options {
			opacity: 0;
		}

		button {
			cursor: default;
		}

		.container {
			gap: 0;
		}
	}
</style>
