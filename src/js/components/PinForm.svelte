<script>
  const keyboard = _.chunk(_.times(9, i => i + 1), 3);
</script>

<div class='pin-form fadeIn'>
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
    <span bind='title'></span>
  </div>
  <div class='pin-dots gtr-ver'>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
  </div>
  <div class="color-light text-xs gtr-ver" bind='placeholder'></div>
  <div class='pin-container'>
    {#each keyboard as row}
      <div class='pin-row'>
        {#each row as i}
          <div class='pin-btn'>{i}</div>
        {/each}
      </div>
    {/each}
    <div class='pin-row'>
      <div class='pin-btn empty'></div>
      <div class='pin-btn' action='0'>0</div>
      <div class='pin-btn' action='-1'>
        <span class='text-xs'>&#9003;</span>
      </div>
    </div>
  </div>
</div>
