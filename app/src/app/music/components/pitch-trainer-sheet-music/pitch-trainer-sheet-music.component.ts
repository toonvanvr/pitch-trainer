import { Component } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import * as alphaTab from '@coderline/alphatab'

// @ts-ignore
globalThis.alphatab = alphaTab

@Component({
  selector: 'app-pitch-trainer-sheet-music',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './pitch-trainer-sheet-music.component.html',
  styleUrl: './pitch-trainer-sheet-music.component.scss',
})
export class PitchTrainerSheetMusicComponent {
  ngAfterContentInit(): void {
    // load elements
    const wrapper = document.querySelector('.at-wrap') as HTMLElement
    const main = wrapper.querySelector('.at-main') as HTMLElement

    // initialize alphatab
    const api = new alphaTab.AlphaTabApi(main, {
      // @ts-ignore
      core: {
        fontDirectory: '/assets/alphatab/font/',
        // useWorkers: false, // scriptFile doesn't seem to change the worker.js download url
        // scriptFile: '/assets/alphatab/alphaTab.js',
      },
      file: 'https://www.alphatab.net/files/canon.gp',
      // @ts-ignore
      player: {
        enablePlayer: true,
        outputMode: alphaTab.PlayerOutputMode.WebAudioScriptProcessor, // FIXME: audio worklets don't seem to work ... ?
        // soundFont: '/assets/alphatab/soundfont/sonivox.sf2',
        scrollElement: wrapper.querySelector('.at-viewport') as HTMLElement,
      },
    } satisfies alphaTab.Settings)

    api.onError = (e) => {
      console.error('CAUGHT ERROR', e)
    }

    // overlay logic
    const overlay = wrapper.querySelector('.at-overlay') as HTMLElement
    api.renderStarted.on(() => {
      console.log('api.renderStarted')
      overlay.style.display = 'flex'
    })
    api.renderFinished.on(() => {
      console.log('api.renderFinished')
      overlay.style.display = 'none'
    })

    // track selector
    function createTrackItem(track: any) {
      const elTrackTemplate = document.querySelector(
        '#at-track-template',
      ) as HTMLTemplateElement
      const trackItemWrapper = elTrackTemplate.content.cloneNode(
        true,
      ) as HTMLDivElement
      const trackItem = trackItemWrapper.firstElementChild as HTMLDivElement
      const trackName = trackItem.querySelector(
        '.at-track-name',
      ) as HTMLDivElement
      trackName.innerText = track.name
      // @ts-ignore
      trackItem.track = track
      trackItem.onclick = (e) => {
        e.stopPropagation()
        api.renderTracks([track])
      }
      return trackItem
    }
    const trackList = wrapper.querySelector('.at-track-list') as HTMLDivElement
    api.scoreLoaded.on((score) => {
      // clear items
      trackList.innerHTML = ''
      // generate a track item for all tracks of the score
      score.tracks.forEach((track) => {
        trackList.appendChild(createTrackItem(track))
      })
    })
    api.renderStarted.on(() => {
      // collect tracks being rendered
      const tracks = new Map()
      api.tracks.forEach((t) => {
        tracks.set(t.index, t)
      })
      // mark the item as active or not
      const trackItems = trackList.querySelectorAll('.at-track')
      trackItems.forEach((trackItem) => {
        // @ts-ignore
        if (tracks.has(trackItem.track.index)) {
          trackItem.classList.add('active')
        } else {
          trackItem.classList.remove('active')
        }
      })
    })

    /** Controls **/
    const elSongTitle = wrapper.querySelector(
      '.at-song-title',
    ) as HTMLDivElement
    const elSongArtist = wrapper.querySelector(
      '.at-song-artist',
    ) as HTMLDivElement
    api.scoreLoaded.on((score) => {
      console.log('api.scoreLoaded')
      elSongTitle.innerText = score.title
      elSongArtist.innerText = score.artist
    })

    const countIn = wrapper.querySelector(
      '.at-controls .at-count-in',
    ) as HTMLAnchorElement
    countIn.onclick = () => {
      countIn.classList.toggle('active')
      if (countIn.classList.contains('active')) {
        api.countInVolume = 1
      } else {
        api.countInVolume = 0
      }
    }

    const metronome = wrapper.querySelector(
      '.at-controls .at-metronome',
    ) as HTMLAnchorElement
    metronome.onclick = () => {
      metronome.classList.toggle('active')
      if (metronome.classList.contains('active')) {
        api.metronomeVolume = 1
      } else {
        api.metronomeVolume = 0
      }
    }

    const loop = wrapper.querySelector(
      '.at-controls .at-loop',
    ) as HTMLAnchorElement
    loop.onclick = () => {
      loop.classList.toggle('active')
      api.isLooping = loop.classList.contains('active')
    }

    const elPrint = wrapper.querySelector(
      '.at-controls .at-print',
    ) as HTMLAnchorElement
    elPrint.onclick = () => {
      api.print()
    }

    const zoom = wrapper.querySelector(
      '.at-controls .at-zoom select',
    ) as HTMLSelectElement
    zoom.onchange = () => {
      const zoomLevel = parseInt(zoom.value) / 100
      api.settings.display.scale = zoomLevel
      api.updateSettings()
      api.render()
    }

    const layout = wrapper.querySelector(
      '.at-controls .at-layout select',
    ) as HTMLSelectElement
    layout.onchange = () => {
      switch (layout.value) {
        case 'horizontal':
          api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal
          break
        case 'page':
          api.settings.display.layoutMode = alphaTab.LayoutMode.Page
          break
      }
      api.updateSettings()
      api.render()
    }

    // player loading indicator
    const playerIndicator = wrapper.querySelector(
      '.at-controls .at-player-progress',
    ) as HTMLSpanElement
    api.soundFontLoad.on((e) => {
      console.log('api.soundFontLoad')
      const percentage = Math.floor((e.loaded / e.total) * 100)
      playerIndicator.innerText = percentage + '%'
    })
    api.playerReady.on(() => {
      console.log('api.playerReady')
      playerIndicator.style.display = 'none'
    })

    // main player controls
    const playPause = wrapper.querySelector(
      '.at-controls .at-player-play-pause',
    ) as HTMLAnchorElement
    const stop = wrapper.querySelector(
      '.at-controls .at-player-stop',
    ) as HTMLAnchorElement
    // @ts-ignore
    playPause.onclick = (e: MouseEvent & { target: HTMLElement }) => {
      if (e.target.classList.contains('disabled')) {
        return
      }
      api.playPause()
    }
    //@ts-ignore
    stop.onclick = (e: MouseEvent & { target: HTMLElement }) => {
      if (e.target.classList.contains('disabled')) {
        return
      }
      api.stop()
    }
    api.playerReady.on(() => {
      playPause.classList.remove('disabled')
      stop.classList.remove('disabled')
    })

    api.playerStateChanged.on((e) => {
      console.log('api.playerStateChanged')
      const icon = playPause.querySelector('mat-icon') as HTMLElement
      if (e.state === alphaTab.synth.PlayerState.Playing) {
        icon.setAttribute('fonticon', 'pause')
      } else {
        icon.setAttribute('fonticon', 'play')
      }
    })

    // song position
    function formatDuration(milliseconds: number) {
      let seconds = milliseconds / 1000
      const minutes = (seconds / 60) | 0
      seconds = (seconds - minutes * 60) | 0
      return (
        String(minutes).padStart(2, '0') +
        ':' +
        String(seconds).padStart(2, '0')
      )
    }

    const songPosition = wrapper.querySelector(
      '.at-song-position',
    ) as HTMLDivElement
    let previousTime = -1
    api.playerPositionChanged.on((e) => {
      console.log('api.playerPositionChanged')
      // reduce number of UI updates to second changes.
      const currentSeconds = (e.currentTime / 1000) | 0
      if (currentSeconds == previousTime) {
        return
      }

      songPosition.innerText =
        formatDuration(e.currentTime) + ' / ' + formatDuration(e.endTime)
    })
  }
}
