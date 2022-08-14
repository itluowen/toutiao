<template>
  <div class="artliem-container">
    <van-row class="padding16">
      <van-col span="15">
        <h5 class="h5mar">{{article.title}}</h5>
      </van-col>
      <van-col span="9" v-if="article.cover.type===1">
        <van-col class="img-con" href="#" tag="a">
          <img :src="article.cover.images[0]" alt="">
        </van-col>
      </van-col>
      <van-col tag="ul" v-else class="listImg" span="24">
        <van-col tag="li" v-for="(item,i) in article.cover.images" :key="i" span="8">
          <img v-lazy="item" alt="">
        </van-col>
      </van-col>
      <van-col span="24" class="text-fontcolor spanmartop">
        <span>作者:{{article.aut_name}}&nbsp;&nbsp;({{article.comm_count}})评论&nbsp;&nbsp;发布日期&nbsp;&nbsp;{{article.pubdate | dateFormat}}</span>
        <van-icon name="cross" size="10" color="#ccc" />
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: 'ArtItem',
  props: {
    // 文章信息对象
    article: {
      type: Object,
      required: true // 必填项
    }
  }
}
</script>

<style lang="less" scoped>
.artliem-container {
  padding: 0.26rem 0.39rem;
  border-bottom: 1px solid rgb(238, 237, 237);
  .h5mar {
    margin-bottom: 10px;
    font-size: 0.37333rem;
  }
  .spanmartop {
    margin-top: 10px;
  }
  .img-con img,
  .listImg img {
    width: 113px;
    height: 70px;
    object-fit: cover;
  }
  .text-fontcolor {
    span {
      color: rgb(191, 191, 191);
      font-size: 0.32rem;
      margin: 0 5px;
    }
  }
  .text-fontcolor {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
