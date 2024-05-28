import { create } from "zustand"


const useSelectedPdf = create((set) => ({
    selectedPdf: null,
    addSelectedPdf: (pdf) => set({ selectedPdf: pdf}),
    removeSelectedPdf: () => set({ pdf: null}),
}))

export default useSelectedPdf;