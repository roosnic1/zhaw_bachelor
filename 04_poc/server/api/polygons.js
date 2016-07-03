const Polygon = require('polygon');


const zones = [
    {
        city: 'zürich',
        customernumber: 200019,
        coords: [[47.402267,8.4553736],[47.401693,8.4554536],[47.3970136,8.4582713],[47.3969076,8.4588981],[47.3968259,8.4593051],[47.396806,8.4594041],[47.3967178,8.4598482],[47.3965572,8.4606094],[47.396546,8.4606606],[47.3962455,8.4619818],[47.3893599,8.4673536],[47.3851249,8.4669525],[47.3689878,8.4647245],[47.3694212,8.4664461],[47.3695985,8.467098],[47.3697544,8.4675579],[47.3704967,8.4759706],[47.3704074,8.476404],[47.3691079,8.4817956],[47.3688674,8.4824601],[47.3686359,8.4831364],[47.3684679,8.4837905],[47.3681858,8.4851095],[47.3666228,8.4895278],[47.3630592,8.4940445],[47.3629928,8.494103],[47.3588118,8.4974987],[47.3530981,8.5010394],[47.3529252,8.5011301],[47.3517871,8.5041506],[47.3517956,8.5043504],[47.3518375,8.5048092],[47.3520024,8.5057362],[47.3509008,8.5134832],[47.3450324,8.5188055],[47.3402511,8.5177414],[47.3383582,8.5163675],[47.3359497,8.5151775],[47.3346457,8.5162775],[47.3350317,8.5192914],[47.3353753,8.5250584],[47.3324918,8.5284815],[47.3319172,8.5298261],[47.3311772,8.5326825],[47.330924,8.5357459],[47.3307701,8.5428778],[47.3312903,8.5454752],[47.3320809,8.5448828],[47.3321137,8.5448559],[47.332587,8.5444671],[47.3353087,8.5428265],[47.3389241,8.539204],[47.3415738,8.5368581],[47.3420771,8.5365543],[47.3452386,8.5353478],[47.3492577,8.5343227],[47.3499792,8.5343172],[47.3501683,8.5343158],[47.350963,8.5342521],[47.3514124,8.5342164],[47.3515146,8.5342082],[47.35201,8.5341713],[47.3573372,8.5354053],[47.3574805,8.5354892],[47.3576046,8.5355372],[47.3579314,8.5355808],[47.358465,8.5355897],[47.359545,8.5354746],[47.3657448,8.5397605],[47.362734,8.5469078],[47.3606133,8.5474713],[47.3594663,8.5476403],[47.358818,8.5481333],[47.3560642,8.5498195],[47.3543072,8.5531361],[47.3539234,8.5537521],[47.3536854,8.5542744],[47.3535581,8.554614],[47.3519668,8.5583083],[47.3498677,8.5608218],[47.347661,8.562648],[47.3469789,8.5632812],[47.3396695,8.5677207],[47.3392103,8.5678517],[47.3390926,8.5678983],[47.3387689,8.5680677],[47.3366001,8.5690662],[47.3366944,8.5705246],[47.3378879,8.5751314],[47.3392222,8.581175],[47.3398078,8.582267],[47.339852,8.5823261],[47.3457068,8.5886999],[47.3466753,8.5894569],[47.3470953,8.5891057],[47.347354,8.5888692],[47.3476089,8.5886019],[47.3552851,8.5926199],[47.3551589,8.5933636],[47.3558604,8.5959087],[47.3561194,8.5991114],[47.3572481,8.5992084],[47.358566,8.5984795],[47.3665584,8.6003466],[47.3683133,8.6023904],[47.3688195,8.6028564],[47.3758188,8.6078239],[47.3777451,8.6068448],[47.3777775,8.6067922],[47.3778253,8.6067146],[47.3784471,8.6056693],[47.3863442,8.6031399],[47.3869687,8.603413],[47.3880714,8.5974704],[47.3882181,8.5968008],[47.3875858,8.5886112],[47.3873226,8.5880481],[47.3877859,8.5820226],[47.3877748,8.5819563],[47.387506,8.5811241],[47.387269,8.580137],[47.3875224,8.5747942],[47.3842452,8.5701078],[47.3842477,8.5638454],[47.3864475,8.5608338],[47.3866705,8.5601186],[47.3887863,8.5565626],[47.3974151,8.5557057],[47.3975783,8.5563868],[47.4033926,8.5608328],[47.4022644,8.5668095],[47.399695,8.5727851],[47.4004714,8.5788291],[47.3994834,8.5835311],[47.3994354,8.5836225],[47.3992269,8.584063],[47.4018973,8.5854589],[47.405276,8.5839245],[47.4081596,8.582024],[47.4099095,8.5807315],[47.4097783,8.5756004],[47.4124465,8.5705739],[47.41293,8.5700474],[47.4168134,8.566632],[47.4218073,8.5603619],[47.4239323,8.5596181],[47.4263077,8.5546607],[47.4275741,8.5460676],[47.4299544,8.53901],[47.4303512,8.5361414],[47.4239724,8.5310786],[47.4239303,8.5285005],[47.4239532,8.5278938],[47.4239811,8.5272357],[47.4240687,8.5264243],[47.4240943,8.5254706],[47.4290524,8.5190583],[47.4275088,8.5113904],[47.4267882,8.5067801],[47.424421,8.5029217],[47.4220587,8.4982422],[47.4211011,8.4987741],[47.4192863,8.4995632],[47.41542,8.5005796],[47.410001,8.4972774],[47.4114753,8.4917136],[47.4119026,8.4913288],[47.416291,8.4846055],[47.4198753,8.4828678],[47.4204527,8.4826235],[47.4205063,8.4825735],[47.4209042,8.4820898],[47.4213061,8.4814116],[47.4168114,8.4779055],[47.4163566,8.4740545],[47.4161047,8.4735493],[47.4122457,8.468551],[47.4127096,8.4644855],[47.4125373,8.4633672],[47.4120552,8.4617107],[47.4111474,8.4597921],[47.4076811,8.4595619],[47.402267,8.4553736]]

    }, {
        city: 'berlin',
        customernumber: 200024,
        coords: [[52.5327899,13.2946649],[52.5308352,13.2988684],[52.530953,13.2996815],[52.5309908,13.2999237],[52.5310573,13.3003763],[52.5311072,13.300743],[52.5312119,13.3014895],[52.5313852,13.3026763],[52.5375993,13.3025302],[52.5394778,13.2989458],[52.5394772,13.2987403],[52.5394769,13.2985757],[52.5413448,13.3005352],[52.5406078,13.3018011],[52.539482,13.3046962],[52.5439127,13.3088221],[52.5477464,13.3048935],[52.547951,13.3049086],[52.5479176,13.3064216],[52.5478592,13.3079622],[52.5478126,13.3089417],[52.547714,13.3110087],[52.5476439,13.3127727],[52.5476047,13.3146084],[52.5475782,13.3154656],[52.5474319,13.316526],[52.5472444,13.3172095],[52.547131,13.3175404],[52.5467982,13.3182273],[52.5463897,13.318731],[52.54528,13.3202647],[52.5446482,13.3210706],[52.5440676,13.3248727],[52.5476965,13.3279047],[52.5472135,13.3290233],[52.5469034,13.3297461],[52.5471869,13.3342294],[52.5477139,13.3350316],[52.5531963,13.3364506],[52.5553578,13.3323358],[52.5561076,13.3310905],[52.5563139,13.3307479],[52.5565507,13.3303545],[52.5567725,13.3299806],[52.5569849,13.329642],[52.5570123,13.329595],[52.5571186,13.3294349],[52.5577681,13.3293756],[52.5599011,13.3300413],[52.5603743,13.3309333],[52.5605746,13.3314199],[52.5609364,13.3335789],[52.5603218,13.3346554],[52.5605329,13.3402451],[52.5603251,13.3463156],[52.5605023,13.3465896],[52.560628,13.3467839],[52.5606915,13.3468821],[52.5608408,13.3471129],[52.5608868,13.347184],[52.5612908,13.3478087],[52.561518,13.3481599],[52.5618462,13.3486674],[52.5611803,13.3488794],[52.5583222,13.3511999],[52.5601991,13.3568897],[52.5615412,13.3599965],[52.5627089,13.3646126],[52.5597755,13.3699412],[52.5614023,13.3755709],[52.5625452,13.3774793],[52.5613155,13.3826929],[52.5618577,13.3849142],[52.5640964,13.3891078],[52.5648286,13.3899576],[52.5650201,13.3942851],[52.5607662,13.3959299],[52.559908,13.3965169],[52.5571282,13.3986318],[52.5557512,13.402777],[52.5556904,13.4040157],[52.5554169,13.4089856],[52.556454,13.4113979],[52.556482,13.4121883],[52.5563428,13.4146098],[52.5561489,13.4153234],[52.554242,13.4184474],[52.5561832,13.4232513],[52.5575927,13.4263321],[52.5565176,13.4292539],[52.556439,13.4294359],[52.5521773,13.4314809],[52.5502469,13.435072],[52.545476,13.4373588],[52.5446951,13.437603],[52.541109,13.4390186],[52.5366243,13.4415867],[52.5358942,13.4433073],[52.53573,13.4473631],[52.5320565,13.4512699],[52.5284631,13.4562188],[52.5256444,13.4546974],[52.5231248,13.4535749],[52.5183122,13.4543906],[52.5177995,13.4571122],[52.5176116,13.4581994],[52.5153434,13.4577545],[52.5124731,13.4524607],[52.5089914,13.4512622],[52.5085597,13.4510319],[52.5080895,13.4507467],[52.5077407,13.4505148],[52.5016951,13.4504305],[52.4975509,13.4483438],[52.4958805,13.4461853],[52.4938434,13.4433425],[52.4924543,13.4409032],[52.4911282,13.437357],[52.4880913,13.4321933],[52.4874423,13.4315416],[52.4862875,13.4294861],[52.4851798,13.4242734],[52.4875016,13.4189109],[52.4881137,13.4142871],[52.4881418,13.414068],[52.4881655,13.4138875],[52.4881725,13.4138343],[52.4872362,13.4082589],[52.4863629,13.4075037],[52.4851284,13.4066487],[52.4831362,13.4044818],[52.4829762,13.4041867],[52.483652,13.3986772],[52.483692,13.3978917],[52.4837447,13.3963276],[52.4837721,13.3951304],[52.4837982,13.3943887],[52.4824666,13.3883884],[52.4833583,13.3827304],[52.4829837,13.3802264],[52.4830257,13.3801357],[52.4850335,13.3764979],[52.4870285,13.3709394],[52.4860809,13.3679604],[52.4851016,13.3647955],[52.4852918,13.3634904],[52.4865171,13.3619352],[52.4859713,13.3560936],[52.4854145,13.3546414],[52.4846583,13.3530335],[52.485313,13.3478949],[52.4837104,13.3450636],[52.4842123,13.3440438],[52.4845547,13.3385162],[52.4840525,13.3370154],[52.4840525,13.3365512],[52.485998,13.3331545],[52.4873522,13.3307843],[52.4911503,13.3264983],[52.4937982,13.3237298],[52.4956072,13.3222174],[52.4981865,13.318721],[52.4997705,13.3140063],[52.4999782,13.3129091],[52.5004262,13.3119333],[52.5024707,13.3079267],[52.5040142,13.3041286],[52.5079678,13.3003932],[52.5097006,13.2981803],[52.5154183,13.2995702],[52.516864,13.2963622],[52.5168528,13.2961389],[52.5194831,13.2957158],[52.524067,13.2975057],[52.526474,13.2972136],[52.5292914,13.2961084],[52.5302369,13.2957149],[52.5327899,13.2946649]]
    }
];

const polygons = zones.map(function(zone) {
    return {
        city: zone.city,
        customernumber: zone.customernumber,
        poly: new Polygon(zone.coords)
    };

});

module.exports = polygons;