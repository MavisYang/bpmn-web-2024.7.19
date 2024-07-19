

export default {
    created() {
      console.log('created');
    },
    beforeMount() {
      console.log('beforeMount');
    },
    mounted(el:, binding) {
      console.log('mounted',el, binding);
    },
    beforeUpdate() {
      console.log('beforeUpdate');
    },
    updated(el, binding) {
      console.log('updated');
    },
    beforeUnmount() {
      console.log('beforeUnmount');
    },
    unmounted() {
      console.log('unmounted');
    }
  }