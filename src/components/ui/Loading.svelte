<div class="spinner">
	<div class="double-bounce1" />
	<div class="double-bounce2" />
</div>

<style>
	.spinner {
		width: 40px;
		height: 40px;

		position: relative;
	}

	.double-bounce1,
	.double-bounce2 {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #e7ddee;
		opacity: 0.6;
		position: absolute;
		top: 0;
		left: 0;

		animation: sk-bounce 2s infinite ease-in-out;
	}

	.double-bounce2 {
		animation-delay: -1s;
	}

	@-webkit-keyframes sk-bounce {
		0%,
		100% {
			transform: scale(0);
		}
		50% {
			transform: scale(1);
		}
	}

	@keyframes sk-bounce {
		0%,
		100% {
			transform: scale(0);
		}
		50% {
			transform: scale(1);
		}
	}
</style>
