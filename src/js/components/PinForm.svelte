<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const pinLength = 6;
  const pinDots = _.times(pinLength);

  let pin = [];
  const keyboard = _.chunk(_.times(9, i => i + 1), 3);

  function submit() {
    dispatch('submit', pin.join(''));
    pin = [];
  }

  function keyClick(action) {
    if (action === -1) {
      pin.pop();
    } else {
      pin.push(action);
    }

    pin = [...pin];

    if (pin.length === pinLength) {
      setTimeout(submit);
    }
  }


</script>

<div class={`pin-form fadeIn ${$$props.pinError ? "pin-error" : ""}`}>
  <div class='text-md gtr-b' id='pin-title'>
    <span class="color-blue head-xs" id='pin-back' style="
      display: none;
      cursor: pointer;
      height: 0.5em;
      width: 1em;
      vertical-align: middle;
      line-height: 0;
      margin-left: -0.2em;">
      &#8592;
    </span>
    <span>
      {$$props.title}
    </span>
  </div>
  <div class='pin-dots gtr-ver'>
    {#each pinDots as dot}
      <div class={pin.length > dot ? "pin-dots-item active" : "pin-dots-item"}></div>
    {/each}
  </div>
  <div class="color-light text-xs gtr-ver">
    {$$props.placeholder || ""}
  </div>
  <div class='pin-container'>
    {#each keyboard as row}
      <div class='pin-row'>
        {#each row as i}
          <div class='pin-btn' on:click={() => keyClick(i)}>{i}</div>
        {/each}
      </div>
    {/each}
    <div class='pin-row'>
      <div class='pin-btn empty'></div>
      <div class='pin-btn' on:click={() => keyClick(0)}>0</div>
      <div class='pin-btn' on:click={() => keyClick(-1)}>
        <span class='text-xs'>&#9003;</span>
      </div>
    </div>
  </div>
</div>
