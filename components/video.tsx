interface Props {
    product?: string;  // ممکنه string باشه یا undefined
}
export default function VideoPlayer({ product }: Props) {
    if (!product) return null; // اگر undefined بود هیچی رندر نمی‌کنه
    return (
        <video className="seo-video rounded-3xl" autoPlay muted loop playsInline>
            <source src={product} type="video/mp4" />
        </video>
    );
}