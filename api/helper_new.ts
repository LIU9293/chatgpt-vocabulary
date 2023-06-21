import { callGptFunction, makeCompletion, FunctionCallResponse } from '../src/openai'
import { askCustomerServiceMessages } from '../src/messages'

export const config = { runtime: 'edge' }

export default async function handler (req) {
  const { searchParams } = new URL(req.url)
  const question = searchParams.get('question') || ''

  const messages = [
    {
      "role": "user",
      "content": question
    }
  ]

  const functions = [
    {
      name: "createOrderForRoom",
      description: "用户在某一个自习室内订座",
      parameters: {
        type: "object",
        properties: {
          roomId: {
            type: "integer",
            description: "roomId可以用来区分需要订座的店铺，其中roomId=37的店铺是南京江北新区店(又称江北店),roomId=40的店铺是张家港店,roomId=41的店铺是南京河西奥体店(又称河西店，奥体店),roomId=43的店铺是南京仙林中心店(又称仙林店),roomId=44的店铺是海拉尔海桥店(又称海桥店),roomId=45的店铺是海拉尔河东店,roomId=46的店铺是苏州狮山店(又称狮山店),roomId=49的店铺是杭州滨江店(又称滨江店),roomId=50的店铺是南京凤凰书城店(又称凤凰店,凤凰书城),roomId=51的店铺是镇江润州店,roomId=52的店铺是南京江宁店(又称江宁店),roomId=53的店铺是阿克苏店,roomId=89的店铺是仙林东南店(又称仙林店),roomId=90的店铺是锦创书城店(又称锦创店,锦创书城),roomId=97的店铺是江浦同心店(又称同心店),roomId=102的店铺是镇江万科店,roomId=116的店铺是扬州京华城店(又称京华城店),roomId=124的店铺是嵊州吾悦店,roomId=135的店铺是南京中和店(又称中和店),roomId=186的店铺是宁波大学店,roomId=201的店铺是南京南站店(又称喜马拉雅店,南站店)",
          },
          deskId: {
            type: "integer",
            description: "座位编号，例如1号，2号，3号"
          }
        },
        required: ["roomId"],
      },
    },
    {
      name: "closeOrder",
      description: "用户关闭订单，结束使用座位",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  ]


  try {
    let response: FunctionCallResponse = await callGptFunction(messages, functions)
    if (!response.isFunction) {
      const newMessages = await askCustomerServiceMessages(question)
      const text = await makeCompletion(newMessages)
      response ={ content: text, isFunction: false, functionCall: null }
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify(error.message),
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      }
    )
  }
}