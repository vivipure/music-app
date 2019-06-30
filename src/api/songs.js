import axios from 'axios'

// 根据id  获得歌曲的url
export function getSong(id) {
    const url = 'http://144.34.146.225:3000'+`/song/url?id=${id}`
    return axios.get(url)
}

// 根据id  获取歌曲的歌词

export function getLyric(id) {
    const url ='http://144.34.146.225:3000'+`/lyric?id=${id}`
    return axios.get(url)
}

