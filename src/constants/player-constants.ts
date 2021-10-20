export class PlayerConstants {
  constructor(
    public start_x: number,
    public start_y: number,
    public baskey_x: number,
    public baskey_y: number,
    public left_code: number,
    public right_code: number,
    public jump_code: number
  ) {
      this.start_x = start_x;
      this.start_y = start_y;
      this.baskey_x = baskey_x;
      this.baskey_y = baskey_y;
      this.left_code = left_code;
      this.right_code = right_code;
      this.jump_code = jump_code;
  }
}

export const player1_constants : PlayerConstants = new PlayerConstants(
  130,
  411,
  130,
  411,
  37,
  39,
  38
)

export const player2_constants : PlayerConstants = new PlayerConstants(
  770,
  440,
  770,
  440,
  65,
  68,
  87
)