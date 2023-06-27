import 'dotenv/config'
import { text2, text3, text4 } from '../data/test'
import { resetDataForNamespace } from "./embed/pinecone"

const run = async () => {

  // chat_channel_<channel_id>
  // moghub_app_<app_id>

  await resetDataForNamespace('mogroom', 'mogroom-user', [text2, text3, text4])
}

run()