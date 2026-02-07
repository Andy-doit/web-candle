import { Leaf, Heart, Award, Clock } from "lucide-react"
import {MissCandleValueProp} from "../../../components";

const features = [
  {
    icon: <Leaf className="text-primary"/>,
    title: "100% Tự Nhiên",
    description: "Sáp đậu nành nguyên chất, không hóa chất độc hại",
  },
  {
    icon: <Heart className="text-primary"/>,
    title: "Làm Thủ Công",
    description: "Mỗi sản phẩm được làm tỉ mỉ bởi nghệ nhân",
  },
  {
    icon: <Award className="text-primary"/>,
    title: "Chất Lượng Cao",
    description: "Tinh dầu thiên nhiên nhập khẩu từ Pháp",
  },
  {
    icon: <Clock className="text-primary"/>,
    title: "Hương Thơm Bền",
    description: "Lưu hương lên đến 50+ giờ đốt liên tục",
  },
]

export default function StorySection() {
  const stats = [
    {
      number: '25+',
      label: 'Năm Kinh Nghiệm',
    },
    {
      number: '50+',
      label: 'Hương Thơm',
    },
    {
      number: '10k+',
      label: 'Khách Hàng',
    },
    {
      number: '100%',
      label: 'Hài Lòng',
    }
  ]

  return (
    <section className="bg-light  pt-5 md:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-primary uppercase mb-3">
            CẬU CHUYỆN CỦA CHÚNG TÔI
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-2">
            Nghệ Thuật <span className="text-primary italic">Thắp Sáng</span>
          </h2>
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-2">
            Tâm Hồn
          </h2>
          <p className="text-dark max-w-2xl mx-auto text-sm md:text-base mt-4">
            Trang trí và thưởng thức nến là cả một nghệ thuật đòi hỏi sự tinh tế. Khi ngọn nến được thắp
            lên, thời gian như chậm lại, mang đến những khoảnh khắc bình yên và thanh thản cho tâm hồn.</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((item, idx) => (
            <div key={idx}>
              <MissCandleValueProp icon={item.icon} title={item.title} description={item.description}/>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-5">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <p className="text-dark font-semibold text-sm md:text-base mb-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
