import { useEffect, useState, useMemo } from 'react';
import { DefaultMeetingSession } from 'amazon-chime-sdk-js';

type useChimeMetricsProps = {
  meetingSession: DefaultMeetingSession;
};

export const useChimeMetrics = ({ meetingSession }: useChimeMetricsProps) => {
  const [videoSendHealth, setVideoSendHealth] = useState<{
    bitrateKbps: number | null;
    packetsPerSecond: number | null;
  }>({ bitrateKbps: null, packetsPerSecond: null });
  const [videoSendBandwidthKbps, setVideoSendBandwidthKbps] = useState<
    number | null
  >(null);
  const [videoReceiveBandwidthKbps, setVideoReceiveBandwidthKbps] = useState<
    number | null
  >(null);

  useEffect(() => {
    const observer = {
      videoSendHealthDidChange: (
        bitrateKbps: number,
        packetsPerSecond: number
      ) => {
        setVideoSendHealth({ bitrateKbps, packetsPerSecond });
      },
      videoSendBandwidthDidChange: (newBandwidthKbps: number) => {
        setVideoSendBandwidthKbps(newBandwidthKbps);
      },
      videoReceiveBandwidthDidChange: (newBandwidthKbps: number) => {
        setVideoReceiveBandwidthKbps(newBandwidthKbps);
      },
    };

    meetingSession.audioVideo.addObserver(observer);

    return () => {
      meetingSession.audioVideo.removeObserver(observer);
    };
  }, [meetingSession]);

  const results = useMemo(
    () => ({
      videoSendBitrateKbps: videoSendHealth.bitrateKbps,
      videoSendPacketsPerSecond: videoSendHealth.packetsPerSecond,
      videoSendBandwidthKbps,
      videoReceiveBandwidthKbps,
    }),
    [videoReceiveBandwidthKbps, videoSendBandwidthKbps, videoSendHealth]
  );

  return results;
};
