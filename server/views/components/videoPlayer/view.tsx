import { cls } from '@/utils';

export function VideoPlayer({ src, cover, className }: { src: string; cover: string; className?: string }) {
  return (
    <div className={cls('video-player', className)}>
      <video
        src={src}
        controls
      ></video>
      <div
        className="video-cover"
        style={{ backgroundImage: `url(${cover})` }}
      >
        <img
          src="/imgs/icon-player.svg"
          className="icon-player"
          alt=""
        />
      </div>
    </div>
  );
}
