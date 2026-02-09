import { Leaf, Heart, Award, Clock } from "lucide-react"
import { MissCandleValueProp } from "../../../components";

const features = [
  {
    icon: <Leaf className="text-primary" />,
    title: "100% Tự Nhiên",
    description: "Sáp đậu nành nguyên chất, không hóa chất độc hại",
  },
  {
    icon: <Heart className="text-primary" />,
    title: "Làm Thủ Công",
    description: "Mỗi sản phẩm được làm tỉ mỉ bởi nghệ nhân",
  },
  {
    icon: <Award className="text-primary" />,
    title: "Chất Lượng Cao",
    description: "Tinh dầu thiên nhiên nhập khẩu từ Pháp",
  },
  {
    icon: <Clock className="text-primary" />,
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
    <section className="bg-light py-12 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-primary tracking-[0.2em] text-xs md:text-sm font-semibold uppercase mb-4">
            CÂU CHUYỆN CỦA CHÚNG TÔI
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-dark mb-3">
            Nghệ Thuật <span className="text-primary italic">Thắp Sáng</span>
          </h2>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-dark mb-6">
            Tâm Hồn
          </h2>
          <p className="text-body text-dark/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Trang trí và thưởng thức nến là cả một nghệ thuật đòi hỏi sự tinh tế. Khi ngọn nến được thắp
            lên, thời gian như chậm lại, mang đến những khoảnh khắc bình yên và thanh thản cho tâm hồn.</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 md:mb-24">
          {features.map((item, idx) => (
            <div key={idx} className="h-full">
              <MissCandleValueProp icon={item.icon} title={item.title} description={item.description} />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-dark/10">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-4">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#9C775B] mb-2 font-serif">
                {stat.number}
              </div>
              <p className="text-dark font-medium text-sm md:text-base uppercase tracking-wider opacity-80">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
