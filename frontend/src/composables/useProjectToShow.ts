import { ref } from "vue";

// A project another section asked to show (its index): the projects section glides
// to it, then clears the request.
const projectToShow = ref<number | null>(null);

export const useProjectToShow = () => projectToShow;
