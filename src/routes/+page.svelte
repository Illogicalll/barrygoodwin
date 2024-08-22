<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import bg from '$lib/assets/bg.jpg';
	import avatar from '$lib/assets/avatar.png';
	import email from '$lib/assets/email.webp';
	import phone from '$lib/assets/phone.png';

	let transitionElement: HTMLElement | null = null;
	let showModal = false;

	function wait(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function gallery() {
		if (transitionElement) {
			transitionElement.style.bottom = '0';
			transitionElement.style.height = '0px';
			transitionElement.style.transition = 'height 0.5s ease';
			transitionElement.offsetHeight;
			transitionElement.style.height = '100dvh';
		}
		await wait(500);
		window.location.href = 'gallery';
	}

	function toggleModal() {
		showModal = !showModal;
	}

	onMount(async () => {
		transitionElement = document.getElementById('transition');

		if (transitionElement) {
			await wait(200);
			transitionElement.style.height = '100dvh';
			transitionElement.style.transition = 'height 0.5s ease';
			transitionElement.offsetHeight;
			transitionElement.style.height = '0px';
		}
	});
</script>

<div class="transition" id="transition" />
<div class="title">
	<h1>Barry</h1>
	<h1>Goodwin</h1>
</div>
<div class="image-container">
	<img alt="bg" src={bg} />
	<div class="overlay"></div>
</div>
<div class="buttons">
	<button on:click={toggleModal}>Contact</button>
	<button on:click={gallery}>Gallery</button>
</div>

{#if showModal}
	<div
		class="modal-backdrop"
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 300 }}
		on:click={toggleModal}
		aria-hidden="true"
	>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			aria-describedby="modal-content"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 300 }}
			on:click|stopPropagation
			tabindex="0"
		>
			<div class="details">
				<img
					alt="User avatar"
					src={avatar}
					style="border-radius: 50%; width: 100px; height: 100px"
				/>
				<h2 id="modal-title">Get in Touch</h2>
			</div>
			<div id="modal-content" class="content">
				<div
					class="option"
					on:click={() => (window.location.href = 'mailto:mail@example.org')}
					on:keydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							window.location.href = 'mailto:mail@example.org';
						}
					}}
					role="button"
					tabindex="0"
					aria-label="Send an email to Barry Goodwin"
				>
					<img alt="Email icon" src={email} style="width: 20px; height: 20px" />
					<p>barry.goodwin@example.com</p>
				</div>
				<div
					class="option"
					on:click={() => (window.location.href = 'tel:123-456-789')}
					on:keydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							window.location.href = 'tel:123-456-789';
						}
					}}
					role="button"
					tabindex="0"
					aria-label="Call Barry Goodwin at +123 456 7890"
				>
					<img alt="Phone icon" src={phone} style="width: 20px; height: 20px" />
					<p>+123 456 7890</p>
				</div>
			</div>
			<div class="close">
				<button
					on:click={toggleModal}
					on:keydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							toggleModal();
						}
					}}
					aria-label="Close modal"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

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
		font-family: 'Panchang-Variable';
	}

	.transition {
		position: absolute;
		top: 0;
		left: 0;
		height: 100dvh;
		width: 100vw;
		background-color: white;
		z-index: 100;
	}

	.buttons {
		position: absolute;
		display: flex;
		bottom: 5%;
		right: 4vw;
		gap: 38px;
	}

	button {
		background-color: white;
		border: none;
		border-radius: 20px;
		color: black;
		width: 200px;
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

	.image-container {
		width: 100vw;
		height: 100dvh;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 25px;
		border: 15px solid white;
		box-sizing: border-box;
		overflow: hidden;
		z-index: -1;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		user-select: none;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.35);
	}

	.title {
		display: flex;
		flex-direction: column;
		line-height: 0px;
		margin-left: 2%;
	}

	h1 {
		font-weight: 605;
		font-size: 130px;
		color: white;
		user-select: none;
	}

	@media (max-width: 870px) {
		h1 {
			font-size: 100px;
			margin-left: 2%;
		}

		.buttons {
			flex-direction: column;
			gap: 20px;
			right: 6vw;
		}
	}

	@media (max-width: 690px) {
		h1 {
			font-size: 80px;
			margin-left: 2%;
		}

		.buttons {
			flex-direction: row;
			width: 100vw;
			justify-content: space-evenly;
			right: 0;
		}
	}

	@media (max-width: 560px) {
		h1 {
			font-size: 60px;
			margin-left: 2%;
		}
	}

	@media (max-width: 430px) {
		h1 {
			font-size: 50px;
			margin-left: 2%;
		}

		button {
			width: 150px;
		}
	}

	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100dvh;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(10px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 200;
	}

	.modal {
		background-color: white;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		width: 40vw;
		height: 40dvh;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-content: space-between;
		justify-content: space-between;
	}

	.details {
		display: flex;
		flex-direction: column;
		gap: 25px;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin-top: 10px;
		margin-bottom: -30px;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 25px;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	@media (max-width: 1222px) {
		.modal {
			width: 80vw;
		}
	}

	@media (max-width: 610px) {
		.option img {
			display: none;
		}
	}

	@media (max-width: 544px) {
		.option img {
			display: block;
		}

		.option p {
			display: none;
		}

		.modal {
			height: 70svh;
		}
	}

	.option {
		width: 80%;
		height: 40px;
		border-radius: 15px;
		border: 1px solid black;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
		background-color: white;
		transition: filter 0.3s ease;
		cursor: pointer;
	}

	.option:hover {
		filter: invert(1);
	}

	.modal h2 {
		margin-top: 0;
	}

	.close {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal button {
		background-color: black;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
		margin-top: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: background-color 0.3s ease;
	}

	.modal button:hover {
		background-color: #333;
	}
</style>
