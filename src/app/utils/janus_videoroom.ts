
interface VideoroomCreateOptions {
  /* This is my awesome room */
  description?: any
  /* true|false (private rooms don't appear when you do a 'list' request) */
  is_private?: any
  /* <optional password needed for manipulating (e.g. destroying) the room> */
  secret?: any
  /* <optional password needed for joining the room> */
  pin?: any
  /* true|false (whether subscriptions are required to provide a valid
    a valid private_id to associate with a publisher, default=false) */
  require_pvtid?: any
  /* <max number of concurrent senders> (e.g., 6 for a video
    conference or 1 for a webinar, default=3) */
  publishers?: any
  /* <max video bitrate for senders> (e.g., 128000) */
  bitrate?: any
  /* <send a FIR to publishers every fir_freq seconds> (0=disable) */
  fir_freq?: any
  /* opus|g722|pcmu|pcma|isac32|isac16 (audio codec to force on publishers, default=opus
    can be a comma separated list in order of preference, e.g., opus,pcmu) */
  audiocodec?: any
  /* vp8|vp9|h264|av1|h265 (video codec to force on publishers, default=vp8
   * can be a comma separated list in order of preference, e.g., vp9,vp8,h264) */
  videocodec?: any
  /* VP9-specific profile to prefer (e.g., "2" for "profile-id=2") */
  vp9_profile?: any
  /* H.264-specific profile to prefer (e.g., "42e01f" for "profile-level-id=42e01f") */
  h264_profile?: any
  /* true|false (whether inband FEC must be negotiated; only works for Opus, default=false) */
  opus_fec?: any
  /* true|false (whether SVC support must be enabled; only works for VP9, default=false) */
  video_svc?: any
  /* true|false (whether the ssrc-audio-level RTP extension must be
    negotiated/used or not for new publishers, default=true) */
  audiolevel_ext?: any
  /* true|false (whether to emit event to other users or not) */
  audiolevel_event?: any
  /* 100 (number of packets with audio level, default=100, 2 seconds) */
  audio_active_packets?: any
  /* 25 (average value of audio level, 127=muted, 0='too loud', default=25) */
  audio_level_average?: any
  /* true|false (whether the video-orientation RTP extension must be
    negotiated/used or not for new publishers, default=true) */
  videoorient_ext?: any
  /* true|false (whether the playout-delay RTP extension must be
    negotiated/used or not for new publishers, default=true) */
  playoutdelay_ext?: any
  /* true|false (whether the transport wide CC RTP extension must be
    negotiated/used or not for new publishers, default=true) */
  transport_wide_cc_ext?: any
  /* true|false (whether this room should be recorded, default=false) */
  record?: any
  /* <folder where recordings should be stored, when enabled> */
  rec_dir?: any
  /* true|false (whether recording can only be started/stopped if the secret
    is provided, or using the global enable_recording request, default=false) */
  lock_record?: any
  /* true|false (optional, whether to notify all participants when a new
    participant joins the room. The Videoroom plugin by design only notifies
    new feeds (publishers), and enabling this may result extra notification
    traffic. This flag is particularly useful when enabled with \c require_pvtid
    for admin to manage listening only participants. default=false) */
  notify_joining?: any
  /* true|false (whether all participants are required to publish and subscribe
    using end-to-end media encryption, e.g., via Insertable Streams; default=false) */
  require_e2ee?: any
}
