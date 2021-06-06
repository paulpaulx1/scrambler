import * as Tone from 'tone';

// const synth = new Tone.Synth().toDestination();

export const synth = new Tone.Synth().toDestination();

export const winSound = () => synth.triggerAttackRelease('C6', '10n');

export const correctSound = () => synth.triggerAttackRelease('C3', '10n');

export const wrongSound = () => synth.triggerAttackRelease('f2', '10n');

export const nextSound = () => synth.triggerAttackRelease('C6', '20n');
