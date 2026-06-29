package wa

import (
	"sync"

	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/proto/waCompanionReg"
	"go.mau.fi/whatsmeow/store"
	"google.golang.org/protobuf/proto"
)

var configureSkipHistorySyncOnce sync.Once

func configureClientHistorySync(client *whatsmeow.Client, skipHistorySync bool) {
	if !skipHistorySync {
		client.ManualHistorySyncDownload = false
		client.DisableManualHistorySyncReceipt = false
		return
	}

	configureSkipHistorySyncOnce.Do(func() {
		store.DeviceProps.RequireFullSync = proto.Bool(false)
		store.DeviceProps.HistorySyncConfig = &waCompanionReg.DeviceProps_HistorySyncConfig{
			FullSyncDaysLimit:              proto.Uint32(0),
			RecentSyncDaysLimit:            proto.Uint32(0),
			FullSyncSizeMbLimit:            proto.Uint32(1),
			StorageQuotaMb:                 proto.Uint32(64),
			InlineInitialPayloadInE2EeMsg:  proto.Bool(false),
			InitialSyncMaxMessagesPerChat:  proto.Uint32(0),
			ThumbnailSyncDaysLimit:         proto.Uint32(0),
			SupportGroupHistory:            proto.Bool(false),
			SupportBotUserAgentChatHistory: proto.Bool(false),
			SupportCallLogHistory:          proto.Bool(false),
		}
	})

	client.ManualHistorySyncDownload = true
	client.DisableManualHistorySyncReceipt = true
}
