import { Settings } from '@coderline/alphatab'

export type AlphaTabApiOptions = Partial<
  Pick<Settings, 'setSongBookModeSettings' | 'fillFromJson'> & {
    file?: string
    core?: Partial<Settings['core']>
    display?: Partial<Settings['display']>
    importer?: Partial<Settings['importer']>
    notation?: Partial<Settings['notation']>
    player?: Partial<Settings['player']>
  }
>
