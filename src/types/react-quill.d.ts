declare module 'react-quill' {
  import * as React from 'react'

  export interface QuillOptions {
    theme?: string
    modules?: any
    formats?: string[]
    bounds?: string | HTMLElement
    scrollingContainer?: string | HTMLElement
    readOnly?: boolean
    placeholder?: string
  }

  export interface ReactQuillProps extends QuillOptions {
    value?: string
    defaultValue?: string
    onChange?: (content: string) => void
    onChangeSelection?: (range: any, source: string, editor: any) => void
    onFocus?: (range: any, source: string, editor: any) => void
    onBlur?: (previousRange: any, source: string, editor: any) => void
    onKeyPress?: React.KeyboardEventHandler<HTMLDivElement>
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
    onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>
    className?: string
    style?: React.CSSProperties
    tabIndex?: number
    preserveWhitespace?: boolean
  }

  export default class ReactQuill extends React.Component<ReactQuillProps> {
    focus(): void
    blur(): void
    getEditor(): any
  }
}
