<template>
  <section
    class="p-3 mx-3 my-6 bg-green-100 rounded-lg shadow-lg md:max-w-3/4 md:mx-auto lg:max-w-1/2"
  >
    <header>
      <h2 class="text-center font-bold my-3 capitalize">
        <slot name="title" />
      </h2>
    </header>
    <div>
      <slot name="content" />
    </div>
  </section>
</template>
