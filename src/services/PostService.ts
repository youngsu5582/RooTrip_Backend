import { Service } from "typedi";
import { CreatePostDto, CreateRatingDto, UpdatePostDto} from "../dtos/PostDto";
import { LikeRepository } from "../repositories/LikeRepository";
import { PostRepository } from "../repositories/PostRepository";
import { Post } from "../entities/index";
import { PostRatingRepository } from "../repositories/PostRatingRepository";
import typia from "typia";
import { POST_DELETE_FAILED, RATING_UPLOAD_FAILED } from "../errors/post-error";
import { In, IsNull } from "typeorm";
import { checkPostViews, getPostViews, increasePostViews } from "../utils/Redis";

@Service()
export class PostService {
  constructor(
    private readonly postRepository: typeof PostRepository,
    private readonly likeRepository: typeof LikeRepository,
    private readonly postRatingRepository :typeof PostRatingRepository
  ) {
    this.postRepository = PostRepository;
    this.likeRepository = LikeRepository;
    this.postRatingRepository = PostRatingRepository;
  }

  public async createPost(createPostDto: CreatePostDto, userId: string) {
    const thumbnailImage = createPostDto.newPhotos[0].url;
    
    return await this.postRepository.save(
      Post.create({ ...createPostDto.article,routes : createPostDto.routes, userId,thumbnailImage })
    );
  }
  public async getPostById(postId: string) {
    
    return await this.postRepository.getPostById(postId);
  }
  public async updatePost(postId: string, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(postId, updatePostDto);
  }
  public async checkUser(userId: string, postId: string) {
    return await this.postRepository.checkUserIdByPostId(userId, postId);
  }
  public async deletePost(postId: string) {
    try{
      await this.postRepository.delete(postId);
      return true;
    }
    catch{
      return typia.random<POST_DELETE_FAILED>();
    }
  }
  public async likePost(userId: string, postId: string) {
    if (await this.likeRepository.checkDuplicate(userId, postId)) return false;
    else return await this.likeRepository.save({ userId, postId });
  }
  public async createPostRating(userId : string,createRatingDtos : CreateRatingDto[]){
    try{
      createRatingDtos.forEach((createRatingDto)=>{
        this.postRatingRepository.save({...createRatingDto,userId})});
        return true;
    }
    catch(err){
        return typia.random<RATING_UPLOAD_FAILED>();
    }
  }


  public async refinePost(posts:string[]){
    const recommendPost = await this.postRepository.getRecentPosts();
    
    const refinePost = await this.postRepository.find({
      
      where:{
        id:In(posts),
        deletedAt:IsNull()
      }
    }).catch(()=>null);
    return [...recommendPost,...(refinePost||[])];
  }
  /**
   * @summary Reddit 의 Nazar Consumer 와 유사한 기능
   * @description postId 와 userId 를 받아서 , 해당 조회가 조회수를 올릴때 유효한지 검증
   * 
   * @param postId 
   * @param userId 
   */
  public async nazar(postId:string,userId:string){
    return await checkPostViews(postId,userId);
  }
  /**
   * 
   * @summary Reddit 의 Abacus Consumer 와 유사한 기능
   * @description postId 와 userId를 받아서 , 조회수를 증가시키고 , set 에 userId 저장
   * 
   * @param postId 
   * @param userId 
   * @returns 
   */
  public async abacus(postId:string,userId:string){
    return await increasePostViews(postId,userId);
  }
  public async getPostViews(postId:string){
    return await getPostViews(postId);
  }

}
