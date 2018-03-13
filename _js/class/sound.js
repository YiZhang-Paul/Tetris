//sound player
export default class Sound {

    constructor() {

        this.sounds = new Map();
    }

    setup(sound, start) {

        if(!this.sounds.has(sound)) {

            this.sounds.set(sound, true);
            //reset on finish
            sound.addEventListener("ended", () => {

                this.reset(sound, start);
            });
        }
    }

    play(sound, start = 0, volume = 1, loop = false) {

        this.setup(sound, start);
        //when sound is ready to play
        if(this.sounds.get(sound)) {

            this.sounds.set(sound, false);
            sound.currentTime = start;
            sound.volume = volume;
            sound.loop = loop;
            sound.play();
        }
    }

    reset(sound, start = 0) {

        if(this.sounds.has(sound) && !this.sounds.get(sound)) {

            sound.currentTime = start;
            sound.pause();
            //indicate reset success
            this.sounds.set(sound, true);
        }
    }

    resetAll() {

        let sounds = document.getElementsByTagName("audio");

        [].forEach.call(sounds, sound => {

            this.reset(sound);
        });
    }
}