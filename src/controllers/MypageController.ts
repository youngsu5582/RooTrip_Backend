import {
    Body,
    HttpCode,
    JsonController,
    Post,
    Req,
    UseBefore
  } from "routing-controllers";
  import { Service } from "typedi";
  import { OpenAPI } from "routing-controllers-openapi";
  import { UpdateNicknameDto, UpdateGenderDto, UpdatePasswordDto } from "../dtos/UserDto";
  import { Request } from "express";
  import {
    checkAccessToken
  } from "../middlewares/AuthMiddleware";
import { MypageService } from "../services/MypageService";
import { ProfileDto } from "../dtos/ProfileDto";
@JsonController("/mypage")
@Service()
export class MypageController {
  constructor(private readonly _mypageService: MypageService) {}

  @HttpCode(201)
  @Post("/account/edit/profile/image")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자의 프로필 사진을을 등록합니다."
  })
  public async uploadProfileImage(
    @Req() req: Request,
    @Body() profileDto: ProfileDto
  ) {
    const userId = req.user.jwtPayload.userId;
    return await this._mypageService.uploadProfileImage(userId, profileDto);
  }

  @HttpCode(201)
  @Post("/account/edit/nickname")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자의 닉네임을 변경합니다."
  })
  public async changeNickname(
    @Req() req: Request,
    @Body() updateNicknameDto: UpdateNicknameDto
  ) {
    const userId = req.user.jwtPayload.userId;
    const nickname = updateNicknameDto.nickname;
    return await this._mypageService.changeNickname(userId, nickname);
  }

  @HttpCode(201)
  @Post("/account/edit/gender")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자의 성별을 수정합니다."
  })
  public async changeGender(
    @Req() req: Request,
    @Body() updateGenderDto: UpdateGenderDto
  ) {
    const userId = req.user.jwtPayload.userId;
    const gender = updateGenderDto.gender;
    return await this._mypageService.changeGender(userId, gender);
  }

  @HttpCode(201)
  @Post("/activity/likes")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자가 추천한 게시글들을 보여줍니다."
  })
  public async likedPostList(@Req() req: Request) {
    const userId = req.user.jwtPayload.userId;
    return await this._mypageService.likedPostList(userId);
  }

  @HttpCode(201)
  @Post("/activity/saved/trip-posts")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자가 저장한 게시글들을 보여줍니다."
  })
  public async savedTripList(@Req() req: Request) {
    const userId = req.user.jwtPayload.userId;
    return await this._mypageService.savedTripList(userId);
  }

  @HttpCode(201)
  @Post("/activity/upload_post")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자가 작성한 게시글들을 보여줍니다."
  })
  public async uploadPostList(@Req() req: Request) {
    const userId = req.user.jwtPayload.userId;
    return await this._mypageService.uploadPostList(userId);
  }

  @HttpCode(201)
  @Post("/account/personal_info/change_password")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자의 비밀번호를 수정합니다."
  })
  public async changePassword(
    @Req() req: Request,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    const userId = req.user.jwtPayload.userId;
    const password = updatePasswordDto.password;
    return await this._mypageService.changePassword(userId, password);
  }

  @HttpCode(201)
  @Post("/account/personal_info/withdrawal")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "회원탈퇴를 합니다."
  })
  public async deleteUser(@Req() req: Request) {
    const userId = req.user.jwtPayload.userId;
    return await this._mypageService.deleteUser(userId);
  }
}