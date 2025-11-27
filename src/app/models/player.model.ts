export class Player  {
  private static instance: Player;
  private audio: HTMLAudioElement | null = null;
  private player: HTMLDivElement | null = null;

  private constructor( ){}

  /**
   *  @example
  * This is a good example
 * Player.getInstance('https://example.com/audio.mp3', 'htmlId')npm start
 * @param {string} audioUrl index de la station seleccionada
 * @param {string} elementId? index de la station seleccionada
 * @returns {Player} return intance of the class
 */
  public static getInstance(audioUrl: string, elementId?: string ): Player {
    if(!this.instance){
      this.instance = new Player()
    }
    this.instance.createAudioObjet(audioUrl);
    if(elementId){
      this.instance.createAudioElement(elementId);
    }
      return this.instance
  }

  private createAudioObjet(audioUrl: string){
    this.audio = new Audio(audioUrl)
    this.audio.autoplay = true;
    this.audio.controls = true;
  }

  private createAudioElement(elementId: string){
    this.player = document.getElementById(elementId) as HTMLDivElement;
    this.player.innerHTML = '';
    this.player.appendChild(this.audio!);
  }

  public start():Promise<void> {
    return this.audio!.play()
  }

  public playPause(){
    if( this.audio!.paused ){
      this.audio?.play()
    }else{
      this.audio!.pause()
    }
  }

  public stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  public destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    if (this.player) {
      this.player.innerHTML = '';
      this.player = null;
    }
  }

}














