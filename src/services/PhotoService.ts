import { Service } from "typedi";
import { CreatePhotoDto } from "../dtos/PhotoDto";
import { PhotoRepository } from "../repositories";

@Service()
export class PhotoService {
  constructor(private readonly _photoRepository: typeof PhotoRepository) {
    this._photoRepository = PhotoRepository;
  }
  public async createPhotos(createPhotoDtos: CreatePhotoDto[], postId: string) {
    try {
      return await Promise.all(createPhotoDtos.map(async (createPhotoDto)=>(await this._photoRepository.createPhoto(createPhotoDto, postId))));
    } catch(err) {
      console.log(err);
      throw Error;
    }
  }
}
