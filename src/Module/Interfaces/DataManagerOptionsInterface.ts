type DataImage = {
    src: string
    title: string
}

export default interface DataManagerOptionsInterface {
    url?: string

    data?: DataImage[]

    responseDataKey: string

    nextPageKey: string
}