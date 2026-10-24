import type Lenis from "lenis";
import { type InjectionKey, inject, type Ref, ref } from "vue";

export const enteredKey: InjectionKey<Ref<boolean>> = Symbol("entered");
export const animationsEnabledKey: InjectionKey<Ref<boolean>> =
	Symbol("animationsEnabled");
export const audioKey: InjectionKey<Ref<HTMLAudioElement | undefined>> =
	Symbol("audio");
export const lenisKey: InjectionKey<() => Lenis | null> = Symbol("lenis");

export const useEntered = () => inject(enteredKey, ref(false));
export const useAnimationsEnabled = () =>
	inject(animationsEnabledKey, ref(true));
