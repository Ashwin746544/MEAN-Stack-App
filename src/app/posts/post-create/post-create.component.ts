import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls:['./post-create.component.css']
})
export class PostCreateComponent implements OnInit,OnDestroy{
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private postId:string;
   post: Post;
   isLoading = false;
   form :FormGroup; //Making for reactive Form Approach
   imagePreview: string;
  // @Output() postCreated = new EventEmitter<Post>();
  // onAddPost(postInput: HTMLTextAreaElement){
  //   console.dir(postInput);
  //   console.log(postInput.value);
  //   const post: Post = {
  //     title: this.enteredTitle,
  //     content: this.enteredContent
  //   }
  //   this.postCreated.emit(post);
  // }
  authStatusSubs: Subscription;

  constructor(public postsService: PostsService,public route: ActivatedRoute,private authService: AuthService){}

  ngOnInit(){
    this.authStatusSubs = this.authService.getAuthStatusListerner().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    )
     this.form = new FormGroup({
       title: new FormControl(null,{validators: [Validators.required,Validators.minLength(3)]}),
       content: new FormControl(null,{validators: [Validators.required]}),
       image: new FormControl(null,{validators: [Validators.required],asyncValidators: [mimeType]})
     });

    this.route.paramMap.subscribe((paramMap)=>{
      if(paramMap.has('postId')){
       this.mode = 'edit';
       this.postId = paramMap.get('postId');
       this.isLoading = true;
       this.postsService.getPost(this.postId).subscribe(post =>
         {
           this.isLoading = false;
         this.post = {
           id: post._id,
           title:post.title,
           content: post.content,
           imagePath: post.imagePath,
           creator: post.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      }else{
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event){
    // const file = event.target.files; //here Angular don't know whether event.target has files property or not so we explicitly defined that like below
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload= ()=>{
     this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  // onSavePost(postForm: NgForm){ //temaplateDriven
  onSavePost(){ //Reactive
    // if(postForm.invalid){
    if(this.form.invalid){
      return;
    }
    this.isLoading = true; //don't need to set false below because we navigate to home page
    if(this.mode === 'edit'){
    // this.postsService.updatPost(this.postId,postForm.value.title,postForm.value.content);
    this.postsService.updatPost(this.postId,this.form.value.title,this.form.value.content,this.form.value.image);
    }else{
      // this.postsService.addPost(postForm.value.title,postForm.value.content);
      this.postsService.addPost(this.form.value.title,this.form.value.content,this.form.value.image);
      // postForm.resetForm();
      this.form.reset();
    }
    // const post: Post = {
    //   title: postForm.value.title,
    //   content: postForm.value.content
    // }
    // this.postCreated.emit(post);
  }
  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }
}
