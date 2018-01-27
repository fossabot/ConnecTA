<template>
    <div>
        <!--
        <md-speed-dial class="md-top-left back-button" md-direction="bottom">
            <md-speed-dial-target class="md-primary">
                <md-icon>arrow_back</md-icon>
            </md-speed-dial-target>
            <md-speed-dial-content></md-speed-dial-content>
        </md-speed-dial>
        -->
        <md-drawer class="md-right" :md-active.sync="showSidepanel">
            <md-toolbar class="md-transparent" md-elevation="0">
                <span class="md-title">Comments</span>
            </md-toolbar>
            <md-button class="md-icon-button" @click="writeComments()">
                <md-icon>add</md-icon>
            </md-button>
            <md-divider></md-divider>
            <div style="margin-top:20px">
                <md-card v-for="comment in comments" :key="comment.id">
                    <md-card-header>
                        <md-card-header-text>
                            <div class="md-subtitle">{{comment.postUser.username}} @ {{comment.time | moment("lll")}}</div>
                        </md-card-header-text>
                    </md-card-header>
                    <md-card-content>
                        {{comment.content}}
                    </md-card-content>
                    <md-card-actions>

                    </md-card-actions>
                </md-card>
            </div>

        </md-drawer>
        <md-dialog-prompt
                :md-active.sync="active"
                v-model="comment"
                md-title="Write a comment"
                md-content="Please abide by the relevant policies and regulations of the Internet in China. We strictly prohibit any pornography, violence or reactionary information."
                md-input-maxlength="128"
                md-input-placeholder="Your thoughts on these photos"
                md-confirm-text="Submit"
                @md-confirm="submitComment()"
        />
        <md-card class="gist">
            <md-card-header>
                <div class="md-title">{{info.title}}</div>
                <div class="md-subtitle">{{info.time | moment("lll")}}</div>
            </md-card-header>

            <md-card-content>
                <span>{{info.description}}</span><br/>
                <span>Total count: {{info.photoCount}} / Featured count: {{info.originCount}}</span>
            </md-card-content>
        </md-card>
        <img class="preview-img photo" v-for="(item, index) in items" :src="item.msrc" @click="$preview.open(index, items, options)">
        <md-speed-dial class="md-top-right back-button" md-direction="bottom" md-event="click">
            <md-speed-dial-target>
                <md-icon class="md-morph-initial">highlight</md-icon>
                <md-icon class="md-morph-final">close</md-icon>
            </md-speed-dial-target>

            <md-speed-dial-content>
                <md-button class="md-icon-button" @click="like()">
                    <md-tooltip v-if="isLiked">Dislike</md-tooltip>
                    <md-tooltip v-else>Like</md-tooltip>
                    <md-icon v-if="isLiked">thumb_down</md-icon>
                    <md-icon v-else>thumb_up</md-icon>
                </md-button>

                <md-button class="md-icon-button" @click="showComments()">
                    <md-tooltip>Comment</md-tooltip>
                    <md-icon>comment</md-icon>
                </md-button>

                <md-button class="md-icon-button" @click="switchPreference()">
                    <md-tooltip v-if="onlyOrigin">Show all the photos</md-tooltip>
                    <md-tooltip v-else>Show only featured photos</md-tooltip>
                    <md-icon v-if="onlyOrigin">launch</md-icon>
                    <md-icon v-else>featured_video</md-icon>
                </md-button>
            </md-speed-dial-content>
        </md-speed-dial>
        <md-snackbar md-positoin="center" :md-active.sync="showSnackbar" md-persistent>
            <span>{{message}}</span>
        </md-snackbar>
    </div>
</template>

<script>
    export default {
        name: "Album",
        data: () => ({
            items: [],
            comments: [],
            options: {
                shareButtons: [
                    {id:'download', label:'Download image', url:'{{raw_image_url}}', download:true}
                ]
            },
            info: {
                title: "",
                description: "",
                originCount: 0,
                photoCount: 0,
                isPublic: false,
                isVisible: false,
                time: null
            },
            showSidepanel: false,
            comment: null,
            active: false,
            isLiked: false,
            showSnackbar: false,
            onlyOrigin: true,
            message: ""
        }),
        mounted: function () {
            this.loadData(true)
        },
        methods: {
            loadData: function(full){
                this.axios.get("/media/gallery/detail",{
                    params: {
                        id: this.$route.params["id"]
                    }
                }).then((response) => {
                    if(full){
                        var items = response.data["data"]["photos"]
                        if(this.onlyOrigin){
                            items = items.filter(item => item.osrc != null)
                        }
                        this.items = items.map(function(val){
                            val.msrc = "/storage/photos/thumb/" + val.msrc
                            val.src = "/storage/photos/hd/" + val.src
                            if(val.osrc != null){
                                val.osrc = "/storage/photos/origin/" + val.osrc
                            }else{
                                val.osrc = null
                            }
                            return val
                        })
                    }
                    this.comments = response.data["data"]["comments"]
                    this.$emit('input', "Gallery - " + response.data["data"]["title"])
                    this.info.title = response.data["data"]["title"]
                    this.info.description = response.data["data"]["description"]
                    this.info.originCount = response.data["data"]["originCount"]
                    this.info.photoCount = response.data["data"]["photoCount"]
                    this.info.isPublic = response.data["data"]["public"]
                    this.info.isVisible = response.data["data"]["visible"]
                    this.info.time = response.data["data"]["time"]
                })
                this.axios.get("/media/gallery/like",{
                    params: {
                        id: this.$route.params["id"]
                    }
                }).then((response) => {
                    this.isLiked = response.data.data
                    console.log(this.isLiked)
                })
            },
            showComments: function(){
                this.showSidepanel = true
            },
            writeComments: function(){
                this.active = true
            },
            submitComment: function(){
                this.axios.post('/media/gallery/comment', {
                    id: this.$route.params["id"],
                    content: this.comment
                }).then((response) => {
                    this.loadData(false)
                    this.showSidepanel = true
                    this.message = "You have successfully submmited your comment."
                    this.showSnackbar = true
                })
            },
            like: function(){
                this.axios.post('/media/gallery/like', {
                    id: this.$route.params["id"]
                }).then((response) => {
                    if(this.isLiked){
                        this.message = "You have canceled your like to this gallery."
                    }else{
                        this.message = "You liked this gallery!"
                    }
                    this.showSnackbar = true
                    this.loadData(false)
                })
            },
            switchPreference: function(){
                this.onlyOrigin = !this.onlyOrigin
                if(this.onlyOrigin)
                    this.message = "Only featured photos will be shown!"
                else
                    this.message = "All the photos will be shown."
                this.showSnackbar = true
                this.loadData(true)
            }
        }
    }
</script>

<style scoped>
    .photo {
        margin:5px;
        max-width:80px;
        min-width:250px;
        width:40%;
    }
    .avatar {
        max-width: 100%;
        height: auto;
        padding: 10px;
    }
    .back-button {
        margin-top: 60px;
    }
    .gist {
        margin: 15px;
    }
</style>