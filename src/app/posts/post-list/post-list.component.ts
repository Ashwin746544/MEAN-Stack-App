import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{
  // posts = [
  //   {title: 'this is first title',content: 'this is content of first post'},
  //   {title: 'this is second title',content: 'this is content of second post'},
  //   {title: 'this is third title',content: 'this is content of third post'},
  // ]

  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  postsSub: Subscription;
  isLoading  = false;
  totalPosts = 0;
  currentPage = 1;
  postsPerPage = 2;
  pageSizeOptions = [1,2,5,10];
  authStatusSubs: Subscription;
  userIsAuthenticated = false;
  userId: string;

  constructor(public postsService: PostsService,private authService: AuthService){}

  ngOnInit(){
    this.isLoading = true;
    // this.posts  = this.postsService.getPosts();
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData : {posts: Post[],postCount: number})=> {
      this.isLoading=false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });
    this.authStatusSubs = this.authService.getAuthStatusListerner().subscribe(
      isAuthenticated =>
      {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      }
    );
    this.userIsAuthenticated = this.authService.getIsAuth();//when we do login and come back to mymessage we don't listen that change of login because our post-list component is loaded after login change so we can't listen that change,SO
    // using this.authService.getIsAuth() we get the previous change of login by getting isAuthenticated variable.
  }
  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    console.log(pageData);
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1; //+ 1, because pageIndex starts from 0
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
  }
  onDelete(postId: String){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
    },error =>{
      this.isLoading = false;
    });
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
