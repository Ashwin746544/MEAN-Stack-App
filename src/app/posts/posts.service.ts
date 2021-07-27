import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts/";
@Injectable({providedIn: 'root'})
export class PostsService{
 private posts: Post[] = [];
 private postUpdated = new Subject<{posts: Post[],postCount: number}>();

 constructor(private http: HttpClient,private router: Router){}

  // getPosts(){
  //   return [...this.posts];//here we don't return posts Array Directly because Array is Call by reference so if we Directly return posts array then anyone can change posts array from any component so because of this we return copy of Posts array using Spread Operator
  // }
  getPosts(postsPerPage: number,currentPage: number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: String,posts: any,maxPosts: number}>(BACKEND_URL + queryParams)
    .pipe(
      map((postData)=>    //map() operator
      {
        return  {posts: postData.posts.map(post=>   //javascript map function not a map() operator
        {
          return {
      id: post._id,
      title: post.title,
      content: post.content,
      imagePath: post.imagePath,
      creator: post.creator
    };
  }),maxPosts: postData.maxPosts}
}
))
  .subscribe((transformedPostData)=>{
    console.log(transformedPostData);
      this.posts = transformedPostData.posts;
      this.postUpdated.next({posts: [...this.posts],postCount: transformedPostData.maxPosts});
    })
  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }

  getPost(id: String){
    // return {...this.posts.find(p => p.id === id)};//return copy of post object
    return this.http.get<{_id: string,title: string,content: string,imagePath: string,creator: string}>(BACKEND_URL+id); //this implementation because of when we reload edit page then we lost data in form ex: http://localhost:4200/edit/60bc48a03f34016498793014 this page
  }

  addPost(title:string,content: string,image: File){
    // const post = {id: null,title: title,content: content};//here in json we cannot store image(File)
    const postData = new FormData();
    postData.append("title",title);
    postData.append("content",content);
    postData.append("image",image,title);//here third arg is filename
    this.http.post<{message:String,post: Post}>(BACKEND_URL,postData).subscribe((responseData)=>{
      // console.log(responseData.message);
      // const post: Post = {
      //   id: responseData.post.id,
      //   title: title,
      //   content: content,
      //   imagePath: responseData.post.imagePath
      // }
      // this.posts.push(post);
      // this.postUpdated.next([...this.posts]);  //Not need more because after adding post we navigate to post-list page where we fetches all posts from database
      this.router.navigate(['/']);
      // here we next the event but we can not listen postUpdated Subject from any Component because we defined this Subject as private so we here create one method getPostUpdateListener() for listening this subject from outside of this PostsService
    });
  }
updatPost(id: String,title:String,content: String,image: File | String){
  let postData;
  if(typeof(image) === 'object'){  //means it is a File Object when we choose image on post-create page
    postData = new FormData();
    postData.append("id", id);
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image,title);
  }else{
    postData= {
      id: id,
      title: title,
      content: content,
      imagePath: image,
      creator: null
    }

  }

  this.http.put(BACKEND_URL+id,postData).subscribe(response => {
    // const updatedPosts = [...this.posts];
    // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
    // updatedPosts[oldPostIndex] = postData;
    // this.posts = updatedPosts;
    // this.postUpdated.next([...this.posts]);//Not need more because after updating post we navigate to post-list page where we fetches all posts from database
    this.router.navigate(['/']);
  });
}

  deletePost(postId:String){
    // this.http.delete('http://localhost:3000/api/posts/'+postId).subscribe(()=>{
    //   const updatedposts = this.posts.filter(post => post.id !== postId);
    //   this.posts = updatedposts;
    // })
    //   this.postUpdated.next([...this.posts]
    // );//Not need more because after deleting post we navigate to post-list page where we fetches all posts from database
   return this.http.delete(BACKEND_URL+postId);
  }
}
