

export default class Song {
  //为什么要设置一个类?
  // 1.优化代码 2.扩展性

  //onstructor 需要什么对象或者数据
  constructor({id,mid,singer,name,album,duration,image,url}){
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

}

// 如果要用class Song 这个类要 new Song({ 很多代码  这里抽象一个工厂方法 让代码变得更少
// 暴露出去的数据 直接就是能用的那种
export function createdSong(musicData){
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`

  })
}

function filterSinger(singer){
  let ret =[]
  if(!singer){
    return ''
  }
  singer.forEach((s)=>{
    ret.push(s.name)
  })
  return ret.join('/')
}
