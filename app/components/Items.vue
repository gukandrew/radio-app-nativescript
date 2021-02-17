<template>
    <Page>
        <ActionBar>
            <Label text="Home"></Label>
        </ActionBar>

        <WrapLayout orientation="horizontal" backgroundColor="lightgray" justifyContent="space-between">
          <StackLayout margin="10" v-for="station in stations" :key="station.name" @tap="playPause(station.url)" horizontalAlignment="center">
            <StackLayout class="album-image" height="120"
              width="135"
              :backgroundImage="station.logo || '~/images/logos/common.png'"
              borderRadius="5">
              <Button
                v-if="isActive(station.url)"
                @tap="playPause(station.url)"
                horizontalAlignment="right"
                marginRight="5"
                marginTop="75" width="40"
                height="40" class="far btn-rounded-sm"
                color="#FFFFFF"
                backgroundColor="#3b75ff">{{isBuffered ? '&#xf04d;' : '&#xf110;'}}</Button>
            </StackLayout>

            <Label fontSize="14" class="font-weight-bold"
              color="#000000" :text="station.name"></Label>
            <!-- <Label fontSize="12" color="#999999" text="2018"></Label> -->
          </StackLayout>

          <VideoPlayer id="nativeVideoPlayer" ref="nativeVideoPlayer" controls="false" loop="true" autoplay="false" height="0" />
       </WrapLayout>
    </Page>
</template>

<script>
  import ItemDetails from "./ItemDetails";
  import { setTimeout } from "tns-core-modules/timer/timer";
  import { topmost } from "@nativescript/core/ui/frame/frame-stack";
  import { Video } from "nativescript-videoplayer";

  export default {
    data() {
      return {
        result: null,
        playeer: null,
        stations: [
          {
            name: 'Львівська хвиля',
            url: 'https://onair.lviv.fm:8443/lviv.fm',
            logo: '~/images/logos/lwr.png'
          },
          {
            name: 'УХ Радіо',
            url: 'http://online.uhradio.ua:8001/efir',
            logo: '~/images/logos/uh.jpg'
          },
          {
            name: 'Люкс ФМ',
            url: 'https://streamvideo.luxnet.ua/luxlviv/luxlviv.stream/playlist.m3u8',
            logo: '~/images/logos/lux.jpg'
          }
        ],
        player: null,
        previousStream: null,
        isPlaying: false,
        isBuffered: false,
        current: null
      };
    },

    mounted() {
      // this.player = topmost().currentPage.getViewById('nativeVideoPlayer');
      this.player = this.$refs.nativeVideoPlayer.nativeView
      this.player.debug = false;

      this.player.on(Video.playbackReadyEvent, () => this.isBuffered = true)
      this.player.on(Video.playbackStartEvent, () => {
        this.current = this.player.src

        const isSame = this.previousStream && (this.previousStream == this.current)
        if (!isSame) {
          this.isBuffered = false
        }

        this.isPlaying = true
      })

      this.player.on(Video.pausedEvent, () => {
        this.previousStream = this.current
        this.current = null

        this.isPlaying = false
      })
    },

    methods: {
      isActive(stationUrl) {
        return this.current == stationUrl
      },

      playPause(stationUrl) {
        this.player.src = stationUrl

        if (this.isPlaying && this.isActive(stationUrl)) {
          this.player.pause()
          return
        }

        this.player.play()
      }
    }
  };
</script>

<style scoped lang="scss">
  // Start custom common variables
  // @import "~@nativescript/theme/scss/variables/blue";
  // End custom common variables

  // Custom styles
  .btn-img{
    border-radius: 5;
    border-width: 1;
    color: white;
    margin: 15;
    font-size: 22;
    border-color: #2b3c6a;
    background-color: #3B5997;
  }

  .album-image{
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
</style>
